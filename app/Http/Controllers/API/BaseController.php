<?php

namespace App\Http\Controllers\API;

use App\Traits\ResponseTrait;
use Illuminate\Routing\Controller as BaseControllerAlias;

class BaseController extends BaseControllerAlias
{
    use ResponseTrait;
}
