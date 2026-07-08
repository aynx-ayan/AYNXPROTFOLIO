const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const hook = `  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    
    const fetchData = async () => {
      try {
        const [projRes, revRes, setRes, analRes] = await Promise.all([
          fetch('/api/projects', { signal }),
          fetch('/api/reviews', { signal }),
          fetch('/api/settings', { signal }),
          fetch('/api/analytics', { signal })
        ]);

        const [projData, revData, setData, analData] = await Promise.all([
          projRes.json(),
          revRes.json(),
          setRes.json(),
          analRes.json()
        ]);

        if (!signal.aborted) {
          setProjects(projData);
          setReviews(revData);
          setSettings(setData);
          setAnalytics(analData);
        }

        // Messages can only be requested if authenticated
        const token = sessionStorage.getItem('ayn_session');
        if (token) {
          const msgRes = await fetch('/api/messages', { 
            headers: { 'Authorization': \`Bearer \${token}\` },
            signal
          });
          const msgData = await msgRes.json();
          if (!signal.aborted) {
            setMessages(msgData);
          }
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Could not fetch intelligence from Full-Stack backend.', error);
        }
      }
    };

    fetchData();
    return () => controller.abort();
  }, [currentPath]);`;

// replace the old fetchData definition and the useEffect
code = code.replace(/const fetchData = async \(\) => \{[\s\S]*?\}\;\s*useEffect\(\(\) => \{\s*fetchData\(\);\s*\}, \[currentPath\]\);/, hook);

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed fetchData race condition');
