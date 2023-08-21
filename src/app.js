/**
 * WordPress Dependencies
 */
import { useState, useEffect } from '@wordpress/element';
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
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal Dependencies
 */
import phpOptions from './options/php';
import wpOptions from './options/wp';

/**
 * Main App Component 
 */
function App() {
    // App state
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

    const [copied, setCopied] = useState({
        value: '',
        status: false
    });

    // Request param
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    // Fetch Theme Suggestions
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

    // Fetch Plugin Suggestions
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

    // Generate URL
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

    // Generate EmbeeCode
    const embedCode = `<iframe src="${playgroundUrl}"></iframe>`;

    // Generate HTML download link
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
                                onClick={() => { 
                                    navigator.clipboard.writeText(playgroundUrl);
                                    setCopied({
                                        value: 'url',
                                        status: true
                                    });
                                    
                                    setTimeout(() => {
                                        setCopied({
                                            value: '',
                                            copied: false
                                        });
                                    }, 1000);
                                }}
                                icon={copy}
                                variant="secondary">
                                {copied.status && copied.value === 'url' ? 'Copied' : 'Url'}
                                </Button>
                            <Button
                                onClick={() => { 
                                    navigator.clipboard.writeText(embedCode);
                                    setCopied({
                                        value: 'embed',
                                        status: true
                                    });
                                    
                                    setTimeout(() => {
                                        setCopied({
                                            value: '',
                                            copied: false
                                        });
                                    }, 1000); 
                                }}
                                icon={copy}
                                variant="secondary">
                                    {copied.status && copied.value === 'embed' ? 'Copied' : 'Embed'}
                                </Button>

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