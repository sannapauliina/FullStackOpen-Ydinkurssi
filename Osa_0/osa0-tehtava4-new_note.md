```mermaid
sequenceDiagram
    participant browser
    participant server

    Note right of browser: Käyttäjä kirjoittaa tekstikenttään ja painaa "tallenna"

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note
    activate server
    Note right of server: Palvelin tallentaa uuden muistiinpanon ja vastaa uudelleenohjauksella
    server-->>browser: 302 Redirect to /notes
    deactivate server

    Note right of browser: Selain seuraa redirectia ja hakee sivun uudelleen

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/notes
    activate server
    server-->>browser: HTML document
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser: CSS file
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
    activate server
    server-->>browser: JavaScript file
    deactivate server

    Note right of browser: Selain suorittaa JavaScriptin, joka hakee muistiinpanot JSON-muodossa

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: JSON (sis. myös uusi muistiinpano)
    deactivate server

    Note right of browser: Selain renderöi muistiinpanot uudelleen, uusi muistiinpano näkyy listassa
    
