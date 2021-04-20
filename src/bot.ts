//    such-coin-many-price-wow
//    A Discord Bot displaying DOGE Value in € and $ (switching every 10s) in status and also via command. Does have other features, too. Maybe.
//    Copyright (C) 2021 DatFlow#0001
//
//    Contact:
//    datflow@radio-rexford.com
//    
//    This program is free software: you can redistribute it and/or modify
//    it under the terms of the GNU Affero General Public License as published
//    by the Free Software Foundation, either version 3 of the License, or
//    (at your option) any later version.
//
//    This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU Affero General Public License for more details.
//
//    You should have received a copy of the GNU Affero General Public License
//    along with this program.  If not, see <https://www.gnu.org/licenses/>.

import botConfig from './config/botConfig';
import BotClient from './client/BotClient';
import dotenv from 'dotenv';

let token = botConfig.botToken
let owners: string[] = botConfig.botOwners.split(",");

const client = new BotClient({ token, owners });

client.start();