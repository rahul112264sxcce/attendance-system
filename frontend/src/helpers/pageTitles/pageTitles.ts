
import React from 'react';


const PageTitles = ({ title }: { title: string }): null => {
    React.useEffect(() => {
        document.title = `${title + " :: Attendance Software"}` || 'Attendance Software';
    }, []);
    return null;
}

export default PageTitles;