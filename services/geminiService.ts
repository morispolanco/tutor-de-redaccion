
import { GoogleGenAI, Type } from "@google/genai";
import type { Correction } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const correctionSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      rule: {
        type: Type.STRING,
        description: 'El nombre conciso de la regla gramatical o de estilo. Ejemplo: "Concordancia de género", "Uso de la coma vocativa".'
      },
      originalFragment: {
        type: Type.STRING,
        description: 'El fragmento exacto del texto original que contiene el error.'
      },
      correctedFragment: {
        type: Type.STRING,
        description: 'La versión corregida del fragmento.'
      },
      explanation: {
        type: Type.STRING,
        description: 'Una explicación clara, amable y educativa de por qué se hizo el cambio, detallando la regla.'
      }
    },
    required: ['rule', 'originalFragment', 'correctedFragment', 'explanation']
  }
};

export const getCorrections = async (text: string): Promise<Correction[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analiza el siguiente texto en español y proporciona sugerencias de mejora:\n\n---\n${text}\n---`,
      config: {
        systemInstruction: `Eres un tutor de redacción experto, amable y paciente, especializado en español. Tu objetivo es ayudar a los usuarios a mejorar su escritura.

**Tu principal fuente de autoridad es el "Libro de estilo de la lengua española" de la Real Academia Española, siguiendo la norma panhispánica.** Todas tus correcciones y explicaciones deben basarse estrictamente en las directrices de este libro.

Analiza el texto proporcionado y desglosa tus sugerencias en correcciones individuales y claras. Para cada corrección, explica la regla gramatical, de puntuación o de estilo de manera sencilla y alentadora, citando los principios del "Libro de estilo". No juzgues, solo enseña. Mantén un tono de profesor comprensivo.

Debes devolver tus hallazgos en formato JSON, siguiendo el esquema proporcionado. Si el texto es perfecto y no necesita correcciones, devuelve un array vacío []. No incluyas un preámbulo o conclusión en tu respuesta JSON, solo el array de correcciones.`,
        responseMimeType: "application/json",
        responseSchema: correctionSchema,
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
        return [];
    }
    const corrections: Correction[] = JSON.parse(jsonText);
    return corrections;
  } catch (error) {
    console.error("Error fetching corrections from Gemini API:", error);
    throw new Error("No se pudieron obtener las correcciones. Inténtalo de nuevo más tarde.");
  }
};

export const getFurtherExplanation = async (correction: Correction): Promise<string> => {
  try {
    const prompt = `
      Por favor, profundiza en esta explicación. Un usuario no entendió completamente. Utiliza como única referencia el "Libro de estilo de la lengua española" de la RAE.

      Regla: ${correction.rule}
      Texto Original: "${correction.originalFragment}"
      Sugerencia: "${correction.correctedFragment}"
      Explicación que diste: "${correction.explanation}"

      Proporciona una explicación alternativa o más detallada basándote estrictamente en la norma panhispánica del "Libro de estilo". Usa analogías o ejemplos adicionales si es útil. Mantén el tono amable y de tutor. Responde directamente con la nueva explicación en texto plano.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    return response.text;
  } catch (error) {
    console.error("Error fetching further explanation from Gemini API:", error);
    throw new Error("No se pudo obtener una explicación más detallada. Inténtalo de nuevo.");
  }
};