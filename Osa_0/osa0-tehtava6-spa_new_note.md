```mermaid
sequenceDiagram
    participant browser
    participant server

    Note right of browser: Käyttäjä kirjoittaa tekstikenttään ja painaa "tallenna"

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    Note right of browser: Body sisältää JSON-dataa { content, date }

    activate server
    Note right of server: Palvelin tallentaa muistiinpanon tietokantaan
    server-->>browser: 201 Created (JSON response)
    deactivate server

    Note right of browser: Selain suorittaa JavaScriptin callbackin ja lisää uuden muistiinpanon suoraan näkymään ilman sivun uudelleenlatausta
    
    

