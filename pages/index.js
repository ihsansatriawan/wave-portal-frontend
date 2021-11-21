import Head from 'next/head'

export default function Home() {
  
  const wave = () => {
    
  }

  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Hey there!
        </div>

        <div className="bio">
          I am Ihsan! Connect your Ethereum wallet and wave at me!
        </div>

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>
      </div>
      <style jsx>{`
        .mainContainer {
          display: flex;
          justify-content: center;
          width: 100%;
          margin-top: 64px;
        }

        .dataContainer {
          display: flex;
          flex-direction: column;
          justify-content: center;
          max-width: 600px;
        }

        .header {
          text-align: center;
          font-size: 32px;
          font-weight: 600;
        }

        .bio {
          text-align: center;
          color: gray;
          margin-top: 16px;
        }

        .waveButton {
          cursor: pointer;
          margin-top: 16px;
          padding: 8px;
          border: 0;
          border-radius: 5px;
          
      }
      `}</style>

      <style jsx global>{`
        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
            'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
            sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        code {
          font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
            monospace;
        }
      `}</style>
    </div>
  );
}
