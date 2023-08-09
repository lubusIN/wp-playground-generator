import { createRoot, render } from '@wordpress/element';

const root = document.getElementById( 'root' );

function App( props ) {
    return (
        <span> {`Hello ${props.msg}!`} </span>
    );
}

const uiElement = (
    <App msg="WordPress Playground"/>
);

if ( createRoot ) {
    createRoot( root ).render( uiElement );
} else {
    render( uiElement, root );
}    