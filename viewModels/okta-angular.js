/* 	Author: Jordan Melberg */
/** Copyright © 2016, Okta, Inc.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 
angular
.module("OktaAuthClient", [])

.factory("widgetManager", function($q) {
	var widget;

    return {
        getWidget: function () {
            return widget;
        },
        initWidget: function(options){
            // Create widget
            //options.redirectUri=$location.protocol();
        	var createWidget = new OktaSignIn(options);
			widget = createWidget; 
        }
    };
});