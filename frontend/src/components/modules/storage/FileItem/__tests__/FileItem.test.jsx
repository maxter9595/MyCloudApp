import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import FileItem from '../index';

// Mock react-icons
jest.mock('react-icons/fa', () => ({
  FaDownload: () => <div>DownloadIcon</div>,
  FaEdit: () => <div>EditIcon</div>,
  FaTrash: () => <div>DeleteIcon</div>,
  FaLink: () => <div>LinkIcon</div>,
  FaSpinner: () => <div>SpinnerIcon</div>,
}));

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

// Mock window.alert
window.alert = jest.fn();

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('FileItem Component', () => {
  const mockFile = {
    id: '1',
    original_name: 'test.pdf',
    size: 1048576, // 1MB
    comment: 'Test comment',
    shared_link: 'abc123',
  };

  const renderComponent = (file = mockFile, store = null) => {
    const defaultStore = mockStore({
      files: {
        loading: false,
      },
    });

    return render(
      <Provider store={store || defaultStore}>
        <FileItem file={file} />
      </Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    global.URL.createObjectURL = jest.fn(() => 'mock-url');
    global.URL.revokeObjectURL = jest.fn();
    process.env.REACT_APP_API_BASE_URL_ORIG = process.env.REACT_APP_API_BASE_URL;
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Восстанавливаем переменную окружения после каждого теста
    process.env.REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL_ORIG;
    console.error.mockRestore();
  });

  it('renders file information correctly', () => {
    renderComponent();

    expect(screen.getByText('test.pdf')).toBeInTheDocument();
    expect(screen.getByText('1.00 MB')).toBeInTheDocument();
    expect(screen.getByText('Test comment')).toBeInTheDocument();
  });

  it('shows edit input when edit button is clicked', () => {
    renderComponent();

    fireEvent.click(screen.getByText('EditIcon'));
    expect(screen.getByDisplayValue('Test comment')).toBeInTheDocument();
  });

  it('calls downloadFile action when download button is clicked', async () => {
    const store = mockStore({
      files: {
        loading: false,
      },
    });

    // Mock the dispatch with unwrap support
    const mockPromise = Promise.resolve(new ArrayBuffer(8));
    mockPromise.unwrap = jest.fn(() => mockPromise);
    store.dispatch = jest.fn(() => mockPromise);

    renderComponent(mockFile, store);
    fireEvent.click(screen.getByText('DownloadIcon'));

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalled();
    });
  });
  
  it('shows confirmation dialog when delete button is clicked', () => {
    window.confirm = jest.fn(() => true);
    renderComponent();

    fireEvent.click(screen.getByText('DeleteIcon'));
    expect(window.confirm).toHaveBeenCalledWith('Вы уверены, что хотите удалить этот файл?');
  });

  it('copies download link when copy link button is clicked', async () => {
    process.env.REACT_APP_API_BASE_URL = 'http://test.com';

    const store = mockStore({
      files: { loading: false },
    });

    // Мокаем dispatch, чтобы вернуть новый shared_link
    const mockResponse = { shared_link: 'new123' };
    const mockPromise = Promise.resolve(mockResponse);
    mockPromise.unwrap = jest.fn(() => mockPromise);
    store.dispatch = jest.fn(() => mockPromise);

    renderComponent(mockFile, store);
    fireEvent.click(screen.getByText('LinkIcon'));

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        'http://test.com/storage/shared/new123/'
      );
    });
  });

  it('shows spinner when downloading', async () => {
    const store = mockStore({
      files: {
        loading: false,
      },
    });

    // Mock the dispatch with a promise that never resolves to keep the loading state
    const mockPromise = new Promise(() => {});
    mockPromise.unwrap = jest.fn(() => mockPromise);
    store.dispatch = jest.fn(() => mockPromise);

    renderComponent(mockFile, store);
    fireEvent.click(screen.getByText('DownloadIcon'));

    // The spinner should appear after click
    await waitFor(() => {
      expect(screen.getByText('SpinnerIcon')).toBeInTheDocument();
    });
  });

  it('updates file comment when save button is clicked', async () => {
    const store = mockStore({
      files: {
        loading: false,
      },
    });

    // Mock the dispatch with unwrap support
    const mockPromise = Promise.resolve({});
    mockPromise.unwrap = jest.fn(() => mockPromise);
    store.dispatch = jest.fn(() => mockPromise);

    renderComponent(mockFile, store);
    fireEvent.click(screen.getByText('EditIcon'));
    fireEvent.change(screen.getByDisplayValue('Test comment'), {
      target: { value: 'New comment' },
    });
    fireEvent.click(screen.getByText('Сохранить'));

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalled();
    });
  });

  it('falls back to execCommand when clipboard API fails', async () => {
    process.env.REACT_APP_API_BASE_URL = 'http://test.com';

    const store = mockStore({
      files: { loading: false },
    });

    // Мокаем dispatch, чтобы вернуть новый shared_link
    const mockResponse = { shared_link: 'fallback123' };
    const mockPromise = Promise.resolve(mockResponse);
    mockPromise.unwrap = jest.fn(() => mockPromise);
    store.dispatch = jest.fn(() => mockPromise);

    navigator.clipboard.writeText.mockRejectedValueOnce(new Error('Clipboard error'));
    document.execCommand = jest.fn().mockReturnValue(true);

    renderComponent(mockFile, store);
    fireEvent.click(screen.getByText('LinkIcon'));

    await waitFor(() => {
      expect(document.execCommand).toHaveBeenCalledWith('copy');
    });
  });
});
