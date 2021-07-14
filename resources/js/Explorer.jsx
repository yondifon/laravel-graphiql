import React, { useEffect, useState } from 'react';
import GraphiQL from 'graphiql';
import GraphiQLExplorer from 'graphiql-explorer';
import { buildClientSchema, getIntrospectionQuery, parse } from 'graphql';
import { makeDefaultArg, getDefaultScalarArgValue } from './customArgs';

import 'graphiql/graphiql.css';

const DEFAULT_QUERY = ``;

function App({ schemaURL, name }) {
    let _graphiql = GraphiQL;

    // Hooks
    const [state, setS] = useState({
        schema: null,
        query: DEFAULT_QUERY,
        explorerIsOpen: true,
    });

    useEffect(() => {
        componentDidMount();
    }, []);

    const fetcher = (params = {}, opts) => {
        const requestHeaders = Object.assign(
            {},
            {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            opts?.headers
        );

        return fetch(schemaURL, {
            method: 'POST',
            headers: requestHeaders,
            body: JSON.stringify(params),
        })
            .then(function (response) {
                return response.text();
            })
            .then(function (responseBody) {
                try {
                    return JSON.parse(responseBody);
                } catch (e) {
                    return responseBody;
                }
            });
    };

    const setState = (key, value) => {
        setS({
            ...state,
            [key]: value,
        });
    };

    const componentDidMount = () => {
        fetcher({
            query: getIntrospectionQuery(),
        }).then((result) => {
            const editor = _graphiql.getQueryEditor();
            editor.setOption('extraKeys', {
                ...(editor.options.extraKeys || {}),
                'Shift-Alt-LeftClick': _handleInspectOperation,
            });

            setState('schema', buildClientSchema(result.data));
        });
    };

    const _handleInspectOperation = (cm, mousePos) => {
        const parsedQuery = parse(state.query || '');

        if (!parsedQuery) {
            console.error("Couldn't parse query document");
            return null;
        }

        var token = cm.getTokenAt(mousePos);
        var start = { line: mousePos.line, ch: token.start };
        var end = { line: mousePos.line, ch: token.end };
        var relevantMousePos = {
            start: cm.indexFromPos(start),
            end: cm.indexFromPos(end),
        };

        var position = relevantMousePos;

        var def = parsedQuery.definitions.find((definition) => {
            if (!definition.loc) {
                console.log('Missing location information for definition');
                return false;
            }

            const { start, end } = definition.loc;
            return start <= position.start && end >= position.end;
        });

        if (!def) {
            console.error(
                'Unable to find definition corresponding to mouse position'
            );
            return null;
        }

        var operationKind =
            def.kind === 'OperationDefinition'
                ? def.operation
                : def.kind === 'FragmentDefinition'
                ? 'fragment'
                : 'unknown';

        var operationName =
            def.kind === 'OperationDefinition' && !!def.name
                ? def.name.value
                : def.kind === 'FragmentDefinition' && !!def.name
                ? def.name.value
                : 'unknown';

        var selector = `.graphiql-explorer-root #${operationKind}-${operationName}`;

        var el = document.querySelector(selector);
        el && el.scrollIntoView();
    };

    const _handleEditQuery = (query) => setState('query', query);

    const _handleToggleExplorer = () => {
        setState('explorerIsOpen', !state.explorerIsOpen);
    };

    return (
        <>
            <div className='graphiql-container'>
                <GraphiQLExplorer
                    schema={state.schema}
                    query={state.query}
                    onEdit={_handleEditQuery}
                    onRunOperation={(operationName) =>
                        _graphiql.handleRunQuery(operationName)
                    }
                    explorerIsOpen={state.explorerIsOpen}
                    onToggleExplorer={_handleToggleExplorer}
                    getDefaultScalarArgValue={getDefaultScalarArgValue}
                    makeDefaultArg={makeDefaultArg}
                ></GraphiQLExplorer>

                <GraphiQL
                    headerEditorEnabled={true}
                    headerEditorActive={true}
                    shouldPersistHeaders={true}
                    ref={(ref) => (_graphiql = ref)}
                    fetcher={fetcher}
                    schema={state.schema}
                    query={state.query}
                    onEditQuery={_handleEditQuery}
                >
                    <GraphiQL.Logo>{name}</GraphiQL.Logo>
                    <GraphiQL.Toolbar>
                        <GraphiQL.Button
                            onClick={() => _graphiql.handlePrettifyQuery()}
                            label='Prettify'
                            title='Prettify Query (Shift-Ctrl-P)'
                        />
                        <GraphiQL.Button
                            onClick={() => _graphiql.handleToggleHistory()}
                            label='History'
                            title='Show History'
                        />

                        <GraphiQL.Button
                            onClick={_handleToggleExplorer}
                            label='Explorer'
                            title='Toggle Explorer'
                        />
                    </GraphiQL.Toolbar>
                </GraphiQL>
            </div>
        </>
    );
}

export default App;
