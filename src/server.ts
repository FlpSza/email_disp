import express from 'express';
import nodemailer from 'nodemailer';
import xlsx from 'xlsx';
import open from 'open';
import path from 'path';
import fs from 'fs';

// Definições
const app = express();
const PORT = 3001;

// Middleware para processar JSON
app.use(express.json());
app.use(express.static('public'));

// Configuração de e-mail (carregando do config.json)
interface EmailConfig {
    email: string;
    password: string;
}

let config: EmailConfig = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));

// Rota para envio de e-mails
    app.post('/send-email', async (req, res) => {
        const { subject, message, emails, attachment, interval } = req.body;

        // Configurar o transporte do e-mail
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: config.email,
                pass: config.password,
            },
        });

        // Enviar e-mails com intervalo
        for (let i = 0; i < emails.length; i++) {
            let mailOptions = {
                from: config.email,
                to: emails[i],
                subject: subject,
                text: message,
                attachments: [
                    { filename: attachment.filename, path: attachment.path }
                ]
            };
            await transporter.sendMail(mailOptions);
            await new Promise(resolve => setTimeout(resolve, interval * 1000)); // Intervalo em segundos
        }

        res.status(200).send('E-mails enviados com sucesso!');
    });

// Endpoint para salvar as configurações de email remetente
app.post('/save-config', (req, res) => {
    const config = req.body;

    fs.writeFileSync('./config.json', JSON.stringify(config, null, 2), 'utf-8');
    res.sendStatus(200);
});

// Iniciar o servidor e abrir o navegador
app.listen(PORT, async () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    await open(`http://localhost:${PORT}`);
});
