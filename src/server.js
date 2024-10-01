"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const open_1 = __importDefault(require("open"));
const fs_1 = __importDefault(require("fs"));
// Definições
const app = (0, express_1.default)();
const PORT = 3000;
// Middleware para processar JSON
app.use(express_1.default.json());
app.use(express_1.default.static('public'));
let config = JSON.parse(fs_1.default.readFileSync('./config.json', 'utf-8'));
// Rota para envio de e-mails
app.post('/send-email', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { subject, message, emails, attachment, interval } = req.body;
    // Configurar o transporte do e-mail
    let transporter = nodemailer_1.default.createTransport({
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
        yield transporter.sendMail(mailOptions);
        yield new Promise(resolve => setTimeout(resolve, interval * 1000)); // Intervalo em segundos
    }
    res.status(200).send('E-mails enviados com sucesso!');
}));
// Iniciar o servidor e abrir o navegador
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Servidor rodando na porta ${PORT}`);
    yield (0, open_1.default)(`http://localhost:${PORT}`);
}));
