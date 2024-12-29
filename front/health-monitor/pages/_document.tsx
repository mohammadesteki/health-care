import { Html, Head, Main, NextScript } from 'next/document'
import {DocumentHeadTags, documentGetInitialProps} from '@mui/material-nextjs/v15-pagesRouter';

export default function Document(props: any) {
    return (
        <Html lang="en">
            <Head>
                <DocumentHeadTags {...props} />
                <title>Health Monitoring APP</title>
                <meta name="description" content="Health Monitoring App"/>
                {/*<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossOrigin=""/>*/}
                {/* Make sure you put this AFTER Leaflet's CSS */}
                {/*<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossOrigin=""></script>*/}
            </Head>
            <body>
            <Main/>
            <NextScript/>
            </body>
        </Html>
    )
}

// @ts-ignore
Document.getInitialProps = async (ctx) => {
    const finalProps = await documentGetInitialProps(ctx);
    return finalProps;
};