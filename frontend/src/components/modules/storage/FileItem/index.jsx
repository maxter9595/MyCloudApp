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
  updateFile,
  updateSharedExpiry
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
    try {
      const response = await dispatch(updateSharedExpiry({
        id: file.id, 
        expiryDays: 7
      })).unwrap();

      const apiBase = process.env.REACT_APP_API_BASE_URL;
      const downloadLink = `${apiBase}/storage/shared/${response.shared_link}/`;
      
      try {
        await navigator.clipboard.writeText(downloadLink);
        alert('Ссылка скопирована! Срок действия: 7 дней');
      } catch (err) {
        const textarea = document.createElement('textarea');
        textarea.value = downloadLink;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('Ссылка скопирована в буфер обмена!');
      }
    } catch (error) {
      console.error('Ошибка при обновлении ссылки:', error);
      alert('Не удалось обновить ссылку');
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
