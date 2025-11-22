const fetch = require('node-fetch');

(async () => {
  try {
    // 抓匯率
    const rateTxt = await fetch("https://corsproxy.io/?https://rate.bot.com.tw/xrt/fltxt/0/day")
      .then(r => r.text());

    const lines = rateTxt.trim().split("\n");
    const usdLine = lines.find(l => l.startsWith("USD"));
    const jpyLine = lines.find(l => l.startsWith("JPY"));

    const usdRate = usdLine.split(/\s+/)[2] + "/" + usdLine.split(/\s+/)[12];
    const jpyRate = jpyLine.split(/\s+/)[2] + "/" + jpyLine.split(/\s+/)[12];

    const message = `最新匯率:\n美金 USD: ${usdRate}\n日圓 JPY: ${jpyRate}\n黃金價格請參考網站`;

    const appId = process.env.ONESIGNAL_APP_ID;
    const restKey = process.env.ONESIGNAL_REST_KEY;

    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${restKey}`
      },
      body: JSON.stringify({
        app_id: appId,
        included_segments: ["Subscribed Users"],
        headings: { en: "匯率 & 黃金通知" },
        contents: { en: message }
      })
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`OneSignal API error: ${response.status} - ${text}`);
    } else {
      console.log("Notification sent successfully!");
    }

  } catch (err) {
    console.error(err);
  }
})();
