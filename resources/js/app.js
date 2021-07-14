import ReactDOM from 'react-dom';
import Explorer from './Explorer';

ReactDOM.render(
    <Explorer {...window.GraphiQLConfig} />,
    document.getElementById('graphiql')
);
