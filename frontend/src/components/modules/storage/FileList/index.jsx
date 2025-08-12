import { memo } from 'react';
import FileItem from '../FileItem';

const FileList = memo(({ files }) => {
  return (
    <div className="file-list">
      {files.length === 0 ? (
        <p>Нет файлов</p>
      ) : (
        files.map((file) => (
          <FileItem 
            key={file.id} 
            file={file} 
          />
        ))
      )}
    </div>
  );
});

export default FileList;
