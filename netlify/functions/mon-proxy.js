// netlify/functions/mon-proxy.js

exports.handler = async function(event, context) {
    
    // 1. Autoriser votre site à accéder à ce fichier
    const headers = {
        "Access-Control-Allow-Origin": "*", 
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET"
    };

    // 2. Récupérer l'URL cachée dans les paramètres Netlify
    const URL_SECRETE = process.env.API_SUJETS;

    if (!URL_SECRETE) {
        return { statusCode: 500, headers, body: JSON.stringify({ error: "Configuration API manquante sur Netlify" }) };
    }

    try {
        // 3. Le serveur va chercher les données (Le hacker ne voit pas ça)
        const response = await fetch(URL_SECRETE);
        
        if (!response.ok) {
            return { statusCode: response.status, headers, body: "Erreur API Externe" };
        }

        const data = await response.json();

        // 4. On renvoie les données propres au site
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(data)
        };

    } catch (error) {
        console.error(error);
        return { statusCode: 500, headers, body: JSON.stringify({ error: "Erreur serveur" }) };
    }
};
