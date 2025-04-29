# Contributing for Localization

## Simple
If you wish to contribute but do not know how to code or use GitHub, you can download the [`en-US.json`](./src/locale/en-US.json) file, translate it into your desired language, and send it to me Discord (@lezzthanthree).

## Advanced
To contribute to the localization of the project, please follow these steps:
1. Fork the repository and clone it to your local machine.
2. Translate the [`en-US.json`](./src/locale/en-US.json) file into your desired language. This is located at [`src/locale`](./src/locale) folder. Save this file with the appropriate locale code (eg: `ja-JP.json`).
3. At [`src/utils/i18ninit.tsx`](./src/utils/i18ninit.tsx), import the locale file. For example, if you are adding Japanese, you would add the following line:
   ```ts
   import ja from '../locale/ja-JP.json';
   ```
4. On the same file, add the locale to the `resources` object. For example, if you are adding Japanese, you would add the following line:
   ```ts
    resources: {
         en: { translation: en },
         ja: { translation: ja },
    },
    ```
5. At [`src/components/SettingsButton.tsx`](./src/components/SettingsButton.tsx), add the language to the `languages` array:
    ```ts
    const languages = [
        { code: 'en', name: 'English' },
        { code: 'ja', name: '日本語' },
    ];
    ```
6. Open a pull request with your changes. 

#### Optional
For creativity, you can translate the flavor texts or add your own at [`src/components/FlavorText.tsx`](./src/components/FlavorText.tsx). **Make sure not to add any offensive or inappropriate texts**.

## About fonts
Currently, the project uses Noto Sans JP via Google Fonts.

If the font is not supported in the language, I'll be adding an additional font that would fit the language and aesthetic of the project.