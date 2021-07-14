<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>{{ config('app.name') }}</title>
    <script>
        @php
        $data = [
            'schemaURL' => route(config('lighthouse.route.name')),
            'name' => config('app.name'),
        ];
        @endphp
        window.GraphiQLConfig = @json($data);
    </script>
    <style>
        body {
            margin: 0;
        }

        .graphiqlarea {
            height: 100vh
        }

    </style>
</head>

<body>
    <div id="graphiql" class="graphiqlarea"></div>

    <script src="{{ mix('js/app.js', 'vendor/graphiql') }}"> </script>
</body>

</html>
