import { createRoot, render } from '@wordpress/element';
import App from './app';

const root = document.getElementById( 'root' );

if ( createRoot ) {
    createRoot( root ).render( <App/> );
} else {
    render( <App/>, root );
}    