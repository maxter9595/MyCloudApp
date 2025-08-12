import { useDropzone } from 'react-dropzone';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect, useCallback, useRef } from 'react';
import { FaSpinner, FaUpload, FaTimes } from 'react-icons/fa';

import {
  fetchFiles,
  uploadFile
} from 'store/slices/filesSlice'

import {
  FileList,
  StorageInfo
} from 'components';

const StoragePage = () => {
  const dispatch = useDispatch();
  const abortControllerRef = useRef(null);
  const { files, loading, error, uploading } = useSelector((state) => state.files);
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});

  useEffect(() => {
    dispatch(fetchFiles());
  }, [dispatch]);

  useEffect(() => {
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;
    dispatch(fetchFiles({ signal }));
    return () => abortControllerRef.current.abort();
  }, [dispatch]);

  const onDrop = useCallback((acceptedFiles) => {
    setIsDragging(false);
    if (acceptedFiles.length === 0) return;
    setFilesToUpload(prev => [
      ...prev, 
      ...acceptedFiles.map(file => ({
        file, 
        comment: '', 
        id: Math.random().toString(36).substring(2, 9)
      }))
    ]);
  }, []);

  const handleUpload = async () => {
    if (filesToUpload.length === 0) return;
    
    const uploadPromises = filesToUpload.map(fileObj => {
      const formData = new FormData();
      formData.append('file', fileObj.file);
      formData.append('comment', fileObj.comment);
      
      return dispatch(uploadFile({
        formData,
        onUploadProgress: (progressEvent) => {
          setUploadProgress(prev => ({
            ...prev,
            [fileObj.id]: Math.round((progressEvent.loaded * 100) / progressEvent.total)
          }));
        }
      })).unwrap();
    });

    try {
      await Promise.all(uploadPromises);
      dispatch(fetchFiles());
      setFilesToUpload([]);
      setUploadProgress({});
    } catch (error) {
      console.error('Ошибка загрузки файлов:', error);
      alert('Ошибка загрузки файлов: ' + (error.message || 'Обратитесь к администратору'));
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files.length) {
      setFilesToUpload(prev => [
        ...prev, 
        ...Array.from(e.target.files).map(file => ({
          file, 
          comment: '', 
          id: Math.random().toString(36).substring(2, 9)
        }))
      ]);
    }
  };

  const updateFileComment = (id, newComment) => {
    setFilesToUpload(prev => 
      prev.map(file => 
        file.id === id ? { ...file, comment: newComment } : file
      )
    );
  };

  const removeFileFromQueue = (id) => {
    setFilesToUpload(prev => prev.filter(file => file.id !== id));
    setUploadProgress(prev => {
      const newProgress = {...prev};
      delete newProgress[id];
      return newProgress;
    });
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
    noClick: true,
    multiple: true
  });

  return (
    <div {...getRootProps()} className="storage-page-container">
      <input {...getInputProps()} />

      {isDragging && (
        <div className="dropzone-overlay">
          <div className="dropzone-content">
            Отпустите файлы для загрузки
          </div>
        </div>
      )}

      <div className="storage-page">
        <h1>Мое хранилище</h1>
        <StorageInfo />

        <div className="upload-section">
          {filesToUpload.length > 0 ? (
            <div className="files-to-upload">
              <h3>Файлы готовы к загрузке:</h3>
              
              {filesToUpload.map((fileObj) => (
                <div key={fileObj.id} className="file-to-upload">
                  <div className="file-info">
                    <p><strong>Имя:</strong> {fileObj.file.name}</p>
                    <p><strong>Размер:</strong> {(fileObj.file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    
                    <div className="form-group">
                      <label htmlFor={`comment-${fileObj.id}`}>Комментарий</label>
                      <input
                        type="text"
                        id={`comment-${fileObj.id}`}
                        value={fileObj.comment}
                        onChange={(e) => updateFileComment(fileObj.id, e.target.value)}
                        placeholder="Добавьте комментарий"
                      />
                    </div>

                    {uploadProgress[fileObj.id] && (
                      <div className="upload-progress">
                        <div 
                          className="progress-bar"
                          style={{ width: `${uploadProgress[fileObj.id]}%` }}
                        ></div>
                        <span>{uploadProgress[fileObj.id]}%</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => removeFileFromQueue(fileObj.id)}
                    className="remove-file-btn"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}

              <div className="upload-actions">
                <button
                  onClick={handleUpload}
                  className="submit-btn"
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <FaSpinner className="spin" /> Загрузка...
                    </>
                  ) : (
                    <>
                      <FaUpload /> Загрузить все файлы
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setFilesToUpload([]);
                    setUploadProgress({});
                  }}
                  className="cancel-btn"
                  disabled={uploading}
                >
                  Отмена
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="file-upload-area">
                <label htmlFor="file-input" className="file-upload-btn">
                  Выберите файлы
                </label>
                <input
                  id="file-input"
                  type="file"
                  onChange={handleFileInputChange}
                  multiple
                  hidden
                />
                <p className="drag-hint">
                  или перетащите файлы в эту область
                </p>
              </div>
            </>
          )}
        </div>

        {error && (
          <div className="storage-error">
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="loading-files">
            <FaSpinner className="spin" /> Загрузка списка файлов...
          </div>
        ) : (
          <FileList files={files} />
        )}
      </div>
    </div>
  );
};

export default StoragePage;
