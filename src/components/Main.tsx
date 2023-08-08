import { ChangeEvent, useState } from 'react';
import './Main.css'

const Main = () => {

    // const [ response, setResponse ] = useState("Tell me 'There was an error with the question'");
    const [response, setResponse] = useState(<div>Hello :)</div>);
    const [ question, setQuestion ] = useState("");
    const [ update, setUpdate ] = useState("nothing so far");
    const [ code, setCode ] = useState([]);

    const API_KEY = "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";
    const API_URL= 'https://api.openai.com/v1/chat/completions';
    
    /**
     * Sends question to gpt-3.5-turbo and updates response state if succesful
     */
    const answer = async () => {
        const prompt = question;
        try {
          setResponse(() => <div>Tinker is thinking</div>);
          const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${API_KEY}`,
            },
            body: JSON.stringify({
              "model": "gpt-3.5-turbo",
              "messages": [
                { role: "system", content: "Your name is tinker. Users ask you questions about their computers and you answer concisely" },
                { role: "assistant", content: prompt }
              ],
            // prompt: prompt,
            // max_tokens: 1024,
            // temperature: 0.6,
            }),
          });
          const data = await response.json();
          format(data.choices[0].message.content.trim());

        } catch (error) {
          console.error('Error classifying articles:', error);
        }
    };

    const format = (content: string) => {
      const codeRegex = /```([^`]+)```/;
      const match = content.match(codeRegex);
      const code = match ? match[1] : '';
      const newContent = content.replace(codeRegex, '');
      
      const responseElements = (
        <div>
          <span>
            { newContent }
          </span>
          { code && (
            <pre className="code-block">
              { code }
            </pre>
          )}
        </div>
      );
      
      setResponse(responseElements);
    };
    

    /**
     * Updates the question to be sent gpt. It updates everythime the value
     * of the text input box is updated.
     * @param e Text Input Box Element
     */
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setQuestion(() => e.target.value);
    }

    /**
     * My verion of loggin directly to the screen
     * @param news what's to be logged
     */
    const log = (news: string) => {
        setUpdate(() => news);
    }

  return (
    <>
        <div className='container'>
          <div className='top'>
              <img className='tinker' src="https://images.pushsquare.com/fa05a241fb111/marvels-spider-man-miles-morales-ps5-playstation-5-1.large.jpg" alt="Miles Morales" />
          </div>
          <div className='middle'>
              <div className='response'>
                <span className='answer'>{ response }</span>
              </div>
          </div>
          <div className='bottom'>
              <input className='input' onChange={handleChange} value={question} type='text' placeholder='Ask away...' />
              <button className='submit' onClick={answer}>Submit</button>
          </div>
        </div>
    </>
  )
}

export default Main