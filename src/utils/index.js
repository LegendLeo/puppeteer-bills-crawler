module.exports = {
  setCookies: async (cookies_str, page, domain) => {
    let cookies = cookies_str.split(';').map(pair => {
      let name = pair.trim().slice(0, pair.trim().indexOf('='));
      let value = pair.trim().slice(pair.trim().indexOf('=') + 1);
      return { name, value, domain };
    });
    await Promise.all(cookies.map(pair => page.setCookie(pair)));
  },
  passTaobaoVerify: async page => {
    await page.waitForTimeout(1000);
    let frame = page.frames()[1];
    if (!frame) return Promise.resolve();
    const sliderElement = await frame.$('.slidetounlock');
    const slider = await sliderElement.boundingBox();

    const sliderHandle = await frame.$('.nc_iconfont.btn_slide');
    const handle = await sliderHandle.boundingBox();

    const slide = async () => {
      await frame.click('.nc_iconfont.btn_slide');
      await page.mouse.move(
        handle.x + handle.width / 3,
        handle.y + handle.height / 2 + Math.random() * 5,
        { steps: 30 }
      );
      await page.mouse.down();
      await page.mouse.move(
        handle.x + slider.width / 2,
        handle.y + handle.height / 2,
        { steps: 30 }
      );
      await page.waitForTimeout(100);
      await page.mouse.move(
        handle.x + slider.width / 2 - 30,
        handle.y + handle.height / 2 + Math.random() * 50,
        { steps: 20 }
      );
      await page.mouse.move(
        handle.x + slider.width,
        handle.y + handle.height / 2 - Math.random() * 50,
        { steps: 60 }
      );
      await page.mouse.up();
      await page.waitForTimeout(500);
      if (await frame.$('.nc_iconfont.icon_warn')) {
        await frame.click('.nc_iconfont.icon_warn');
        await slide()
      }
    }
    await slide();
  },
};
