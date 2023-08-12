import {
    Panel,
    PanelBody,
    PanelRow,
    Button,
    CustomSelectControl,
    FormTokenField,
    TextControl,
    TextareaControl,
    ToggleControl,
    __experimentalToggleGroupControl as ToggleGroupControl,
    __experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';
import { copy, settings, share, download } from '@wordpress/icons';
import { useState, useEffect } from '@wordpress/element';
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

    const [pluginSuggestion, setPluginSuggestion] = useState([]);
    const [pluginsData, setPluginsData] = useState([]);
    const [selectedPlugins, setSelectedPlugins] = useState([]);

    const [themeSuggestion, setThemeSuggestion] = useState([]);
    const [themesData, setThemesData] = useState([]);
    const [selectedTheme, setSelectedTheme] = useState([]);

    const [Url, setUrl] = useState('/wp-admin/');
    const [hasSeamlessMode, setSeamlessMode] = useState(true);
    const [hasLazyLoading, setLazyLoading] = useState(true);
    const [hasAutoLogin, setAutoLogin] = useState(true);
    const [selectedStorage, setStorage] = useState('temporary');

    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    useEffect(() => {
        fetch(`https://api.wordpress.org/themes/info/1.2/?action=query_themes&request[search]=${themeSuggestion}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                const pluck = (arr, key) => arr.map(i => i[key]);
                const themesSuggestion = pluck(result.themes, 'slug');
                setThemesData(themesSuggestion);
            })
            .catch(error => console.log('error', error));
    }, [themeSuggestion]);

    useEffect(() => {
        fetch(`https://api.wordpress.org/plugins/info/1.2/?action=query_plugins&request[search]=${pluginSuggestion}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                const pluck = (arr, key) => arr.map(i => i[key]);
                const pluginsSuggestion = pluck(result.plugins, 'slug');
                setPluginsData(pluginsSuggestion);
            })
            .catch(error => console.log('error', error));
    }, [pluginSuggestion]);

    const baseUrl = 'https://playground.wordpress.net';
    const args = {
        php: phpVersion,
        wp: wpVersion,
        theme: selectedTheme ? selectedTheme : [],
        url: Url,
        storage: selectedStorage
    };

    hasLazyLoading && (args.lazy = true);
    hasSeamlessMode && (args.mode = 'seamless');
    hasAutoLogin && (args.login = 1);

    let playgroundUrl = addQueryArgs(baseUrl, args);

    if(selectedPlugins.length) {
        const plugins = selectedPlugins.map((plugin) => `plugin=${plugin}`);
        playgroundUrl = `${playgroundUrl}&${plugins.join('&')}`;
    }

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
            <div id="sidebar">
                <Panel header="Playground">
                    <PanelBody title="Config" icon={settings} initialOpen={true}>
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
                            onInputChange={(tokens) => setPluginSuggestion(tokens)}
                            suggestions={pluginsData}
                        />

                        <FormTokenField
                            label="Theme"
                            maxLength={1}
                            value={selectedTheme}
                            onChange={(tokens) => setSelectedTheme(tokens)}
                            onInputChange={(tokens) => setThemeSuggestion(tokens)}
                            suggestions={themesData}
                        />

                        <TextControl
                            label="Landing Url"
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
                    </PanelBody>
                    <PanelBody title="Share" icon={share} initialOpen={true}>
                        <TextControl label="Playground Url" value={playgroundUrl} />
                        <TextareaControl
                            help="use this to embed playground in your html"
                            label="Embed Code"
                            value={embedCode}
                        />
                        <PanelRow>
                            <Button
                                onClick={() => { navigator.clipboard.writeText(playgroundUrl) }}
                                icon={copy}
                                variant="secondary">Url</Button>
                            <Button
                                onClick={() => { navigator.clipboard.writeText(embedCode) }}
                                icon={copy}
                                variant="secondary">Embed</Button>

                            <Button href={downloadUrl} icon={download} download="my-playground.html" variant="secondary">Html</Button>

                        </PanelRow>

                    </PanelBody>
                </Panel>
            </div>

            <div id="preview" dangerouslySetInnerHTML={{__html: embedCode}}>
            </div>
        </>
    );
}

export default App;