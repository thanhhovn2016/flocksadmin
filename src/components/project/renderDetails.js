import DOMPurify from 'isomorphic-dompurify';
export const renderRawHTML = (content) => {
    const cleanHTML = DOMPurify.sanitize(content, {
        USE_PROFILES: {html: true}
    });

    return <div dangerouslySetInnerHTML={{__html: cleanHTML}}/>
}