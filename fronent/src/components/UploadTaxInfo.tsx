import React, { useState } from 'react';
import axios from 'axios';

const UploadTaxInfo: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            try {
                await axios.post('/api/tax/upload/', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                alert('文件上传成功');
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>上传员工纳税信息</h2>
            <input type="file" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} required />
            <button type="submit">上传</button>
        </form>
    );
};

export default UploadTaxInfo;
