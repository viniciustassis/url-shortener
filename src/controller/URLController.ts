import { Request, Response } from "express";
import shortId from "shortid";
import { config } from "../config/Constants";

export class URLController {
    public async shorten(req: Request, response: Response): Promise<void> {
        // Verificar se a URL não existe
        const { originURL } = req.body;
		const url = await URLModel.findOne({ originURL })
		if (url) {
			response.json(url)
			return
		}

        // Criar o hash para a URL
        const hash = shortId.generate();
        const shortURL = `${config.API_URL}/${hash}`;
        
        // Salvar a URL no banco de dados
        const newURL = await URLModel.create({ hash, shortURL, originURL });

        // Retornar a URL salva
        response.json(newURL);
    }

    public async redirect(req: Request, response: Response): Promise<void> {
        // Pegar o hsah da URL
        const { hash } = req.params;
        
        // Encontrar a URL original pelo hash
        /* const url = {
            "originURL": "https://ge.globo.com/",
            "hash": "E7XlF8WLh",
            "shortURL": "http://localhost:5000/E7XlF8WLh"
        } */
        const url = await URLModel.findOne({ hash })

        // Redirecionar para a URL original do resultado do banco
		if (url) {
			response.redirect(url.originURL)
			return
		}        
        
        response.status(400).json({ error: 'URL not found' })
    }
}