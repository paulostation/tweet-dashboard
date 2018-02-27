# Real time tweet analysis !

This repository holds the code for [this](https://tweet-dashboard.mybluemix.net/) webapp.

The purpose is to analyze tweets doing sentiment analysis in real time.

ToDo:

Criar uma view que receba as keys e separe tanto tweets negativos quanto positivos na mesma view

Eu provavelmente preciso fazer um emit {"timestamp": doc.timestamp, "sentiment": doc.bla.bla.bla.sentiment} e depois passar uma key pra separar primeiro por sentiment depois por timestamp depois agrupar

Usage
---

```
DEBUG=app:* npm start
```