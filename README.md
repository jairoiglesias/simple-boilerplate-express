# GeoLocation Search

## Simple API REST para localizar enderecos usando CEP

- NodeJS
- Express
- ViaCEP API (FREE)
- Nominatim Geocoder


## Como usar:

**GET**

```
[URL_ROOT]/places/placesByCEP/[SEU CEP SOMENTE NUMEROS]
```

**[RESPONSE]**

```
[
    {
        "endereco": "[STRING]",
        "numero": "[STRING]",
        "bairro": "[STRING]",
        "municipio": "[STRING]",
        "uf": "[STRING]",
        "latitude": "[STRING",
        "longitude": "[STRING]",
        "cnpj": "[STRING]",
        "distance": "[NUMBER]"
    }
]
```

