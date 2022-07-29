import 'content/app.less';
import NProgress from 'nprogress';
import '../node_modules/nprogress/nprogress.css';
import 'react-toastify/dist/ReactToastify.css';
import Router from 'next/router';

Router.events.on('routeChangeStart', () => {
    NProgress.start();
});

Router.events.on('routeChangeComplete', () => {
    NProgress.done();
});
function MyApp({ Component, pageProps }) {
    return <Component {...pageProps} />;
}

MyApp.getInitialProps = async({ Component, ctx }) => {
    let pageProps = {};
    if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps(ctx);
    }
    return { pageProps };
};
export default MyApp;
