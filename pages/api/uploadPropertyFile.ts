import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { extractCookies } from '@/pages/api/utils';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { id } = req.query;
        const { token, refreshToken } = extractCookies(req);

        if (!token || !refreshToken) {
            return res.status(401).json({ message: 'Invalid cookie format' });
        }

        const form = formidable({
            multiples: true,
            keepExtensions: true,
        });
        form.parse(req, async (err, fields, formFiles) => {
            if (err) {
                return res.status(500).json({ message: 'Error parsing form data' });
            }

            const files = formFiles.file as formidable.File[] | formidable.File;

            const axiosInstance = axios.create({
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            async function uploadFile(file: formidable.File, axiosInstance: any, id: string | string[]) {
                const formData = new FormData();
                const fileStream = fs.createReadStream(file.filepath);
                const buffer = await streamToBuffer(fileStream);
                const blob = new Blob([buffer]);
                formData.append('file', blob, file.originalFilename as string);

                await axiosInstance.post(`http://localhost:8080/api/v1/properties/${id}/upload`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }

            function streamToBuffer(stream: fs.ReadStream): Promise<Buffer> {
                return new Promise((resolve, reject) => {
                    const chunks: any[] = [];
                    stream.on('data', (chunk) => chunks.push(chunk));
                    stream.on('end', () => resolve(Buffer.concat(chunks)));
                    stream.on('error', reject);
                });
            }

            try {
                if (Array.isArray(files)) {
                    // Handle multiple files
                    for (const file of files) {
                        await uploadFile(file, axiosInstance, id as string | string[]);
                    }
                } else {
                    // Handle single file
                    await uploadFile(files, axiosInstance, id as string | string[]);
                }
                res.status(200).json({ message: 'File(s) uploaded successfully' });
            } catch (error) {
                console.error('Error uploading file:', error);
                res.status(500).json({ message: 'Error uploading file' });
            }
        });
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
