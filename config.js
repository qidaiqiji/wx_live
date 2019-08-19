const mock = false;
const newMock = false;
const testUrl = true;
const url = mock ? 'https://dsn.apizza.net/mock/6b8a0f18635f92d7acf8e6185f3d4e13/' : newMock ? 'http://192.168.0.231:3000/mock/40/' : testUrl ? 'https://testapi.xiaomei360.com/' :'https://api.xiaomei360.com/'


export default { url }

