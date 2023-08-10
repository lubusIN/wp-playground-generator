import {
    Button,
    CustomSelectControl,
    FormTokenField,
    TextControl,
    ToggleControl,
    __experimentalToggleGroupControl as ToggleGroupControl,
    __experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';
import { useState } from '@wordpress/element';

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
    const [phpVersion, setPhpVersion] = useState(phpOptions[3]);
    const [wpVersion, setWpVersion] = useState(phpOptions[0]);
    const [selectedPlugins, setSelectedPlugins] = useState([]);
    const [selectedThemes, setSelectedThemes] = useState([]);
    const [Url, setUrl] = useState('/wp-admin/');
    const [hasSeamlessMode, setSeamlessMode] = useState(false);
    const [hasLazyLoading, setLazyLoading] = useState(false);
    const [hasAutoLogin, setAutoLogin] = useState(true);
    const [selectedStorage, setStorage] = useState('temporary');

    return (
        <>
            <CustomSelectControl
                __nextUnconstrainedWidth
                label="Php"
                options={phpOptions}
                onChange={({ selectedItem }) => setPhpVersion(selectedItem)}
                value={phpOptions.find((option) => option.key === phpVersion.key)}
            />

            <CustomSelectControl
                __nextUnconstrainedWidth
                label="WP"
                options={wpOptions}
                onChange={({ selectedItem }) => setWpVersion(selectedItem)}
                value={wpOptions.find((option) => option.key === wpVersion.key)}
            />

            <FormTokenField
                label="Plugins"
                value={selectedPlugins}
                onChange={(tokens) => setSelectedPlugins(tokens)}
            />

            <FormTokenField
                label="Themes"
                value={selectedThemes}
                onChange={(tokens) => setSelectedThemes(tokens)}
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

            <ToggleGroupControl label="Storage" value={selectedStorage} isBlock onChange={() => {
                setStorage((state) => !state);
            }}>
                <ToggleGroupControlOption value="temporary" label="Temporary" />
                <ToggleGroupControlOption value="browser" label="Browser" />
                <ToggleGroupControlOption value="host" label="Host" />
            </ToggleGroupControl>
            <Button variant="primary">Launch!</Button>
        </>
    );
}

export default App;