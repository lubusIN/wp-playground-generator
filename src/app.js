import {
    Button,
    CustomSelectControl,
    FormTokenField,
    TextControl,
    TextareaControl,
    ToggleControl,
    __experimentalToggleGroupControl as ToggleGroupControl,
    __experimentalToggleGroupControlOption as ToggleGroupControlOption,
    SandBox,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';

const phpOptions = [
    {
        key: 'latest',
        name: 'latest',
    },
    {
        key: '8.2',
        name: '8.2',
    },
    {
        key: '8.1',
        name: '8.1',
    },
    {
        key: '8.0',
        name: '8.0',
    },
    {
        key: '7.4',
        name: '7.4',
    },

    {
        key: '7.3',
        name: '7.3',
    },
    {
        key: '7.2',
        name: '7.2',
    },
    {
        key: '7.1',
        name: '7.1',
    },
    {
        key: '7.0',
        name: '7.0',
    },
    {
        key: '5.6',
        name: '5.6',
    },
];

const wpOptions = [
    {
        key: 'latest',
        name: 'latest',
    },
    {
        key: '6.2',
        name: '6.2',
    },
    {
        key: '6.1',
        name: '6.1',
    },
    {
        key: '6.0',
        name: '6.0',
    },
    {
        key: '5.9',
        name: '5.6',
    },
];

function App() {
    const [phpVersion, setPhpVersion] = useState(phpOptions[3].key);
    const [wpVersion, setWpVersion] = useState(phpOptions[0].key);
    const [selectedPlugins, setSelectedPlugins] = useState([]);
    const [selectedTheme, setSelectedTheme] = useState([]);
    const [Url, setUrl] = useState('/wp-admin/');
    const [hasSeamlessMode, setSeamlessMode] = useState(false);
    const [hasLazyLoading, setLazyLoading] = useState(false);
    const [hasAutoLogin, setAutoLogin] = useState(true);
    const [selectedStorage, setStorage] = useState('temporary');

    const baseUrl = 'https://playground.wordpress.net';
    const args = {
        php: phpVersion,
        wp: wpVersion,
        theme: selectedTheme ? selectedTheme : '',
        url: Url,
        storage: selectedStorage
    };

    hasLazyLoading && (args.lazy = true);
    hasSeamlessMode && (args.mode = 'seamless');
    hasAutoLogin && (args.login = 1);

    const plugins = selectedPlugins.map((plugin) => `plugin=${plugin}`);

    let playgroundUrl = addQueryArgs(baseUrl, args);
    playgroundUrl = playgroundUrl + '&' + plugins.join('&');

    const embedCode = `<iframe src="${playgroundUrl}"></iframe>`;
    
    // For download
    const htmlContent = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Playground</title>
    </head>
    <body>
        <style>
            * {
                padding: 0;
                margin: 0;
            }
            iframe {
                width: 100vw;
                height: 100vh;
                border: none;
            }
        </style>
        ${embedCode}
    </body>
    </html>`;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const downloadUrl = URL.createObjectURL(blob);
  

    return (
        <>
            <CustomSelectControl
                __nextUnconstrainedWidth
                label="Php"
                options={phpOptions}
                onChange={({ selectedItem }) => setPhpVersion(selectedItem.key)}
                value={phpOptions.find((option) => option.key === phpVersion)}
            />

            <CustomSelectControl
                __nextUnconstrainedWidth
                label="WP"
                options={wpOptions}
                onChange={({ selectedItem }) => setWpVersion(selectedItem.key)}
                value={wpOptions.find((option) => option.key === wpVersion)}
            />

            <FormTokenField
                label="Plugins"
                value={selectedPlugins}
                onChange={(tokens) => setSelectedPlugins(tokens)}
            />

            <TextControl
                label="Theme"
                value={selectedTheme}
                onChange={(tokens) => setSelectedTheme(tokens)}
            />

            <TextControl
                label="Url"
                value={Url}
                onChange={(value) => setUrl(value)}
            />

            <ToggleControl
                label="Seamless Mode"
                checked={hasSeamlessMode}
                onChange={() => {
                    setSeamlessMode((state) => !state);
                }}
            />
            <ToggleControl
                label="Lazy Load"
                checked={hasLazyLoading}
                onChange={() => {
                    setLazyLoading((state) => !state);
                }}
            />
            <ToggleControl
                label="Login"
                checked={hasAutoLogin}
                onChange={() => {
                    setAutoLogin((state) => !state);
                }}
            />

            <ToggleGroupControl label="Storage" value={selectedStorage} isBlock onChange={(storage) => {
                setStorage(storage);
            }}>
                <ToggleGroupControlOption value="temporary" label="Temporary" />
                <ToggleGroupControlOption value="opfs-browser" label="Browser" />
                <ToggleGroupControlOption value="opfs-host" label="Host" />
            </ToggleGroupControl>
            <Button href={playgroundUrl} target="_blank" variant="primary">Launch 🚀</Button>
            <TextControl label="Playground Url" value={playgroundUrl} />
            <TextareaControl
                help="use this to embed playground in your html"
                label="Embed Code"
                value={embedCode}
            />
            <Button href={downloadUrl} download="my-playground.html" variant="primary">Download ⬇</Button>

            <SandBox html={`<iframe width="100%" height="800" src="${playgroundUrl}"> </iframe>`} title="Playground" type="embed" />

        </>
    );
}

export default App;