<?php

// config/cors.php

return [

    'paths' => ['*'],  // Allow all paths
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:3000', 'https://www.speedcartapp.com'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,

];
