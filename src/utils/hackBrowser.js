
module.exports = async function (page) {
  await page.evaluateOnNewDocument(() => {
    // const browser = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36';
    const browser =  'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36';
    Object.defineProperty(navigator, 'userAgent', {
      //userAgent在无头模式下有headless字样，所以需覆盖
      get: () => browser
    });
  });
  // plugins设置
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'plugins', {
      //伪装真实的插件信息
      get: () => [
        {
          0: {
            type: 'application/x-google-chrome-pdf',
            suffixes: 'pdf',
            description: 'Portable Document Format',
            enabledPlugin: Plugin,
          },
          description: 'Portable Document Format',
          filename: 'internal-pdf-viewer',
          length: 1,
          name: 'Chrome PDF Plugin',
        },
        {
          0: {
            type: 'application/pdf',
            suffixes: 'pdf',
            description: '',
            enabledPlugin: Plugin,
          },
          description: '',
          filename: 'mhjfbmdgcfjbbpaeojofohoefgiehjai',
          length: 1,
          name: 'Chrome PDF Viewer',
        },
        {
          0: {
            type: 'application/x-nacl',
            suffixes: '',
            description: 'Native Client Executable',
            enabledPlugin: Plugin,
          },
          1: {
            type: 'application/x-pnacl',
            suffixes: '',
            description: 'Portable Native Client Executable',
            enabledPlugin: Plugin,
          },
          description: '',
          filename: 'internal-nacl-plugin',
          length: 2,
          name: 'Native Client',
        },
      ],
    });
  });
  // languages设置
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'languages', {
      //添加语言
      get: () => ['zh-CN', 'zh', 'en'],
    });
  });
};
