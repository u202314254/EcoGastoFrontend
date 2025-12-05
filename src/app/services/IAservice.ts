import { Injectable } from '@angular/core';



@Injectable({
    providedIn: 'root'
})
export class IAService {

    private apiKey = "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";
    private url = "https://openrouter.ai/api/v1/chat/completions";


    constructor() { }

    async generarRecomendacion(prompt: string): Promise<string> {
        try {
            const res = await fetch(this.url, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${this.apiKey}`,
                    "Content-Type": "application/json",
                    "X-Title": "EcoGasto-App",
                    "HTTP-Referer": "http://localhost:4200",
                },
                body: JSON.stringify({
                    model: "meta-llama/llama-3.1-8b-instruct",
                    messages: [
                        { role: "user", content: prompt }
                    ]
                })
            });

            if (!res.ok) {
                console.log(await res.text());
                throw new Error("Error de autorización");
            }

            const data = await res.json();
            return data.choices?.[0]?.message?.content || "No se pudo generar respuesta";

        } catch (e) {
            console.error("Error IA:", e);
            return "Error generando la recomendación.";
        }
    }
}
