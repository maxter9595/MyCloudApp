import React from 'react';
import { useState, memo } from 'react';
import { useDispatch } from 'react-redux';
import {
  FaDownload,
  FaEdit,
  FaTrash,
  FaLink,
  FaSpinner
} from 'react-icons/fa';

import {
  deleteFile,
  downloadFile,
  updateFile
} from 'store/slices/filesSlice';

const FileItem = memo(({ file }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [comment, setComment] = useState(file.comment);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const dispatch = useDispatch();

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await dispatch(downloadFile(file.id)).unwrap();
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.original_name);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Ошибка скачивания файла:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Вы уверены, что хотите удалить этот файл?')) {
      setIsDeleting(true);
      try {
        await dispatch(deleteFile(file.id)).unwrap();
      } catch (error) {
        console.error('Ошибка удаления файла:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await dispatch(updateFile({ 
        id: file.id, 
        data: { comment } 
      })).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error('Ошибка обновления файла:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const copyDownloadLink = async () => {
    const apiBase = process.env.REACT_APP_API_BASE_URL;
    const downloadLink = `${apiBase}/storage/shared/${file.shared_link}`;
    const downloadLinkWithSlash = `${downloadLink}/`;

    try {
      await navigator.clipboard.writeText(downloadLinkWithSlash);
      alert('Ссылка скопирована!');
    } catch (err) {
      console.error('Ошибка копирования (Clipboard API):', err);
      try {
        const textarea = document.createElement('textarea');
        textarea.value = downloadLinkWithSlash;
        textarea.style.position = 'fixed';
        document.body.appendChild(textarea);
        textarea.select();
        
        const success = document.execCommand('copy');
        document.body.removeChild(textarea);
        
        if (success) {
          alert('Ссылка скопирована');
        } else {
          alert(`Ссылка для скачивания файла: ${downloadLink}`);
        }
      } catch (fallbackError) {
        console.error('Ошибка fallback-копирования:', fallbackError);
        alert(`Не удалось скопировать автоматически. Ссылка: ${downloadLink}`);
      }
    }
  };

  return (
    <div className="file-item">
      <div className="file-info">
        <span>{file.original_name}</span>
        <span>{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
        {isEditing ? (
          <input 
            value={comment} 
            onChange={(e) => setComment(e.target.value)}
            disabled={isUpdating}
          />
        ) : (
          <span>{file.comment}</span>
        )}
      </div>

      <div className="file-actions">
        <button 
          onClick={handleDownload} 
          title="Скачать"
          disabled={isDownloading}
        >
          {isDownloading ? <FaSpinner className="spin" /> : <FaDownload />}
        </button>

        <button 
          onClick={copyDownloadLink} 
          title="Копировать ссылку"
        >
          <FaLink />
        </button>

        <button 
          onClick={() => setIsEditing(!isEditing)} 
          title={isEditing ? 'Отмена' : 'Редактировать'}
          disabled={isUpdating}
        >
          <FaEdit />
        </button>

        {isEditing && (
          <button 
            onClick={handleUpdate}
            disabled={isUpdating}
          >
            {isUpdating ? <FaSpinner className="spin" /> : 'Сохранить'}
          </button>
        )}

        <button 
          onClick={handleDelete} 
          title="Удалить"
          disabled={isDeleting}
        >
          {isDeleting ? <FaSpinner className="spin" /> : <FaTrash />}
        </button>
      </div>
    </div>
  );
});

export default FileItem;
