/**
 * WordPress Dependencies
 */
import { createRoot, render } from '@wordpress/element';
import '@wordpress/components/build-style/style.css';

/***
 * Internal Dependencies
 */
import './app.css';
import App from './app';

/**
 * Create App Root
 */
const root = document.getElementById( 'root' );

if ( createRoot ) {
    createRoot( root ).render( <App/> );
} else {
    render( <App/>, root );
}    