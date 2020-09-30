//#region api

/*
 * cached (does it really affect anything?), documented and snake_cased onetap api functions, 
 * in ecmascript 5 unfortunately due to api restrictions i'll miss you => :(
 * scroll down for an example, you can hide that whole var with the editor.
 * some functions might not work on the cracked version of onetap
 */
var globals = {
    realtime: function () {
        return Globals.Realtime()
    }, // Returns time in seconds since CS:GO was started.
    frametime: function () {
        return Globals.Frametime()
    }, // Returns time in seconds it took to render the frame.
    curtime: function () {
        return Globals.Curtime()
    }, // Returns the game time in seconds.
    tick_interval: function () {
        return Globals.TickInterval()
    }, // Returns the time elapsed in one game tick in seconds.
    tickrate: function () {
        return Globals.Tickrate()
    }, // Returns server tick settings.
    tickcount: function () {
        return Globals.Tickcount()
    } // Returns amount of ticks elapsed on the server.
};
var menu_elements = {};
const menu_spacer = "                                                                                  ";
var menu = {
    // for the ui i decided to use better_ui since it's cleaner and better.

    /**
     * @title BetterUI
     * @version 2.2.0
     * @description A better UI system for Onetap
     */

    /**
     * Concats two elements into an array without increasing the array length.
     * Prevents the memory leak in 2.0.0 from happening
     *
     * @param a {array}
     * @param b {any}
     */
    concat: function (a, b) {
        var arr = [];

        for (var c in a) {
            arr.push(a[c]);
        }

        arr.push(b);

        return arr;
    },

    /**
     * Creates a new menu label
     *
     * @param label {string}
     */
    label: function (label) {
        UI.AddLabel(label);
    },

    /**
     * @returns {*}
     */
    is_opened: function () {
        return UI.IsMenuOpen();
    },

    /**
     * Creates a new menu element
     *
     * @param func {function}
     * @param name {string}
     * @param label {string},
     * @param properties {array}
     */
    new: function (func, name, label, properties, initial_value) {
        properties = properties || [];
        initial_value = initial_value || undefined;

        const final_name = name + menu_spacer + label;
        var final_props = [final_name];

        const element_info_t = {
            path: ["Misc", "JAVASCRIPT", "Script Items", final_name],
            cache: initial_value,
            func: func
        };

        if (properties != null) {
            for (var i = 0; i < properties.length; i++) {
                final_props.push(properties[i]);
            }
        }

        func.apply(null, final_props);

        if (initial_value) {
            switch (func) {
                case UI.AddColorPicker:
                    UI.SetColor.apply(null, this.concat(element_info_t.path, initial_value));
                    break;

                case UI.AddHotkey:
                    break;

                default:
                    UI.SetValue.apply(this, this.concat(element_info_t.path, initial_value));
                    break;
            }
        }

        menu_elements[label] = element_info_t;

        return element_info_t;
    },

    /**
     * Creates a new menu reference
     *
     * @param path {array}
     */
    reference: function (path) {
        return {
            path: path
        };
    },

    /**
     * Gets the value of a menu element
     *
     * @param elem {array}
     * @return {*}
     */
    get: function (elem) {
        if (!(elem.path))
            throw new Error("[Menu] This element doesn't exist!");

        switch (elem.func) {
            case UI.AddColorPicker:
                return UI.GetColor.apply(null, elem.path);

            case UI.AddHotkey:
                return UI.IsHotkeyActive.apply(null, elem.path);

            default:
                return UI.GetValue.apply(null, elem.path);
        }
    },

    /**
     * Sets the value of a menu element
     *
     * @param elem {array}
     * @param value {*}
     */
    set: function (elem, value) {
        if (!(elem.path))
            throw new Error("[Menu] This element doesn't exist!");

        switch (elem.func) {
            case UI.AddColorPicker:
                UI.SetColor.apply(null, this.concat(elem.path, value));
                break;

            case UI.AddHotkey:
                if (menu.get(elem) !== value)
                    UI.ToggleHotkey.apply(null, elem.path);
                break;

            default:
                UI.SetValue.apply(null, this.concat(elem.path, value));
                break;
        }
    },

    /**
     * Changes the visibility of a menu elements
     *
     * @param elem {array}
     * @param visible {boolean}
     */
    visibility: function (elem, visible) {
        if (!(elem.path))
            throw new Error("[Menu] This element doesn't exist!");

        UI.SetEnabled.apply(null, this.concat(elem.path, visible));
    },

    /**
     * Adds an event to a menu element which is triggered everytime this element's value is changed.
     * 
     * @param elem {array}
     * @param func {function}
     */
    add_event: function (elem, func) {
        if (!elem.path)
            throw new Error("[Menu] This element doesn't exist!");

        elem.callback = func;
    },

    /**
     * Handles the menu elements' events. Call this inside Draw callback.
     */
    handle_events: function () {
        for (var label in menu_elements) {
            const elem = menu_elements[label];

            if (!elem.path || !elem.callback)
                continue;

            const value = menu.get(elem);

            if (elem.cache === undefined)
                elem.cache = value;

            if (elem.cache !== value) {
                elem.callback.apply(null, [elem]);
                elem.cache = value;
            }
        }
    }
};
var entity = {
    get_render_box: function (entity_index) {
        return Entity.GetRenderBox(entity_index);
    }, // Returns an array object with state (valid/invalid), min X, min Y, max X, max Y
    get_weapons: function (entity_index) {
        return Entity.GetWeapons(entity_index);
    }, // Returns an array of weapons of the entity.
    get_entities_by_classid: function (classid) {
        return Entity.GetEntitiesByClassID(classid);
    }, // Returns entities of given Class ID.
    get_hitbox_position: function (entity_index, hitbox_index) {
        return Entity.GetHitboxPosition(entity_index, hitbox_index);
    }, // Returns an array object with X, Y, Z for hitbox position. https://pastebin.com/raw/nXLuPMhi
    get_eye_position: function (entity_index) {
        return Entity.GetEyePosition(entity_index);
    }, // Returns an array object with X, Y, Z for eye position.
    get_game_rules_proxy: function () {
        return Entity.GetGameRulesProxy();
    }, // Returns entity index of game rules entity.
    is_bot: function (entity_index) {
        return Entity.IsBot(entity_index);
    }, // Returns true or false.
    get_weapon: function (entity_index) {
        return Entity.GetWeapon(entity_index);
    }, // Returns player weapon name.
    set_prop: function (entity_index, table_name, prop_name) {
        return Entity.SetProp(entity_index, table_name, prop_name);
    }, // Set value of property.
    get_prop: function (entity_index, table_name, prop_name) {
        return Entity.GetProp(entity_index, table_name, prop_name);
    }, // Returns the value of the property.
    get_render_origin: function () {
        return Entity.GetRenderOrigin();
    }, // Returns an array of x, y, z.
    get_name: function (entity_index) {
        return Entity.GetName(entity_index);
    }, // Returns a string that is the player name.
    get_class_name: function () {
        return Entity.GetClassName();
    }, // Returns a string that represents the class name instead of the class ID.
    get_classid: function (entity_index) {
        return Entity.GetClassID(entity_index);
    }, // Returns the class ID.
    is_dormant: function (entity_index) {
        return Entity.IsDormant(entity_index);
    }, // Finds out whether an entity is dormant.
    is_alive: function (entity_index) {
        return Entity.IsAlive(entity_index);
    }, // Finds out whether an entity is alive.
    is_valid: function (entity_index) {
        return Entity.IsValid(entity_index);
    }, // Finds out whether an entity is valid.
    is_local_player: function (entity_index) {
        return Entity.IsLocalPlayer(entity_index);
    }, // Finds out whether an entity is the local player.
    is_enemy: function (entity_index) {
        return Entity.IsEnemy(entity_index);
    }, // Finds out whether an entity is an enemy.
    is_teammate: function (entity_index) {
        return Entity.IsTeammate(entity_index);
    }, // Finds out whether an entity is a teammate.
    get_entity_from_userid: function (userid) {
        return Entity.GetEntityFromUserID(userid);
    }, // Finds the entity of the given user id.
    get_local_player: function () {
        return Entity.GetLocalPlayer();
    }, // Returns the entity index of local the player.
    get_teammates: function () {
        return Entity.GetTeammates();
    }, // Returns an array of teammate entity indexes.
    get_enemies: function () {
        return Entity.GetEnemies();
    }, // Returns an array of enemy entity indexes.
    get_players: function () {
        return Entity.GetPlayers();
    }, // Returns an array of player entity indexes.
    get_entities: function () {
        return Entity.GetEntities();
    } // Returns an array of entity indexes.
};
var render = {
    filled_circle: function (x, y, r, color) {
        return Render.FilledCircle(x, y, r, color);
    }, // Draws a filled circle with the given position, radius, and RGBA color.
    textured_rect: function (x, y, width, height, texture) {
        return Render.TexturedRect(x, y, width, height, texture);
    }, // Draws a textured rectangle with the given position, size, and texture.
    add_texture: function (path) {
        return Render.AddTexture(path);
    }, // Adds a texture.
    text_size_custom: function (text, font) {
        return Render.TextSizeCustom(text, font);
    }, // Finds the text width size of the given string with custom font.
    string_custom: function (x, y, align, text, color, font) {
        return Render.StringCustom(x, y, align, text, color, font);
    }, // Used to draw string with custom font.
    find_font: function (name, size, weight) {
        return Render.FindFont(name, size, weight);
    }, // Used to search for font identifier.
    add_font: function (name, size, weight) {
        return Render.AddFont(name, size, weight);
    }, // Adds a custom font.
    polygon: function (
        x, y,
        x1, y1,
        x2, y2, r, g, b, a) {
        return Render.Polygon(
            x, y,
            x1, y1,
            x2, y2, r, g, b, a);
    }, // Draws a polygon with shape based on arguments passed.
    text_size: function (text, size) {
        size = size || 0; // Had to add otherwise wont work.
        return Render.TextSize(text, size);
    }, // Finds the text width size of the given string.
    get_screen_size: function () {
        return Render.GetScreenSize();
    }, // Returns width and height of your screen.
    world_to_screen: function (x, y, z) {
        return Render.WorldToScreen(x, y, z);
    }, // Finds the world position for the given screen position.
    circle: function (x, y, r, color) {
        return Render.Circle(x, y, r, color);
    }, // Draws a circle with the given position, radius, and RGBA color.
    filled_rect: function (x, y, width, height, color) {
        return Render.FilledRect(x, y, width, height, color);
    }, // Draws a filled rectangle with the given position, size, and RGBA color.
    rect: function (x, y, width, height, color) {
        return Render.Rect(x, y, width, height, color);
    }, // Draws a rectangle with the given position, size, and RGBA color.
    line: function (x, y, x1, y1, color) {
        return Render.Line(x, y, x1, y1, color);
    }, // Draws a line with the given position and RGBA color.
    string: function (x, y, align, message, color, size) {
        size = size || 0; // Had to add otherwise wont work.
        return Render.String(x, y, align, message, color, size);
    }, // Draws a string with the given position, align, RGBA color, and size.
    gradient_rect: function (x, y, w, h, dir, color, color2) {
        return Render.GradientRect(x, y, w, h, dir, color, color2);
    } // Draws a gradient rectangle with the given position, size, and RGBA color.
};
var convar = {
    set_string: function (command, string) {
        return Convar.SetString(command, string);
    }, // Sets the string value of the given console command.
    get_string: function (command) {
        return Convar.GetString(command);
    }, // Finds the string value of the given console command.
    set_float: function (command, value) {
        return Convar.SetFloat(command, value);
    }, // Sets the float value of the given console command.
    get_float: function (command) {
        return Convar.GetFloat(command);
    }, // Finds the float value of the given console command.
    set_int: function (command, value) {
        return Convar.SetInt(command, value);
    }, // Sets the integer value of the given console command.
    get_int: function (command) {
        return Convar.GetInt(command);
    } // Finds the integer value of the given console command.
};
var event = {
    get_string: function (string) {
        return Event.GetString(string);
    }, // Finds the string value of the given game event.
    get_float: function (float) {
        return Event.GetFloat(float);
    }, // Finds the float value of the given game event.
    get_int: function (int) {
        return Event.GetInt(int);
    } // Finds the integer value of the given game event.
};
var trace = {
    // https://pastebin.com/raw/UiPxXSBn
    raw_line: function (skip_index, start, end, mask, type) {
        return Trace.RawLine(skip_index, start, end, mask, type);
    }, // Used for advanced line tracing.
    smoke: function (start, end) {
        return Trace.Smoke(start, end);
    }, // Used to check if smoke is between two points.
    bullet: function (entity_index, target, start, end) {
        return Trace.Bullet(entity_index, target, start, end);
    }, // Used to trace bullet between two entities.
    line: function (entity_index, start, end) {
        return Trace.Line(entity_index, start, end);
    } // Used to trace line between point A and B.
};
var user_cmd = {
    get_movement: function () {
        return UserCMD.GetButtons();
    }, // Used to obtain movement values.
    set_view_angles: function (x, y, z, silent) {
        return UserCMD.SetViewAngles(x, y, z, silent);
    }, // Control user angles.
    send: function () {
        return UserCMD.Send();
    }, // Used to send commands.
    choke: function () {
        return UserCMD.Choke();
    }, // Used to choke commands.
    set_buttons: function () {
        return UserCMD.SetButtons();
    }, // Used to set buttons.
    get_buttons: function () {
        return UserCMD.GetButtons();
    }, // Used to get buttons.
    set_movement: function (forwardmove, sidemove, upmove) {
        return UserCMD.SetMovement(forwardmove, sidemove, upmove);
    } // Control user movement.
};
var sound = {
    stop_microphone: function () {
        return Sound.StopMicrophone();
    }, // Used to stop Sound.PlayMicrophone
    play_microphone: function () {
        return Sound.PlayMicrophone();
    }, // Plays a sound on microphone.
    play: function (path) {
        return Sound.Play(path);
    } // Plays a sound.
};
var local = {
    get_inaccuracy: function () {
        return Local.GetInaccuracy();
    }, // Returns inaccuracy.
    get_spread: function () {
        return Local.GetSpread();
    }, // Returns spread.
    get_fake_yaw: function () {
        return Local.GetFakeYaw();
    }, // Returns fake yaw angle.
    get_real_yaw: function () {
        return Local.GetRealYaw();
    }, // Returns real yaw angle.
    set_clan_tag: function (text) {
        return Local.SetClanTag(text);
    }, // Used to set clan tag.
    set_view_angles: function (array) {
        return Local.SetViewAngles(array);
    }, // Sets user-defined view angles.
    get_view_angles: function () {
        return Local.GetViewAngles();
    }, // Returns array object with pitch, yaw and roll
    latency: function () {
        return Local.Latency();
    } // Returns local player ping to the server.
};
var client = {
    get_username: function () {
        return Cheat.GetUsername();
    }, // Returns forum username.
    print_chat: function (text) {
        return Cheat.PrintChat(text);
    }, // Prints a message in in-game chat.
    callback: function (callback, fun) {
        switch (callback) {
            case 'create_move':
                Cheat.RegisterCallback("CreateMove", fun);
                break;
            case 'paint':
                Cheat.RegisterCallback("Draw", fun);
                break;
            case 'frame_stage_notify':
                Cheat.RegisterCallback("FrameStageNotify", fun);
                break;
            case 'shutdown':
                Cheat.RegisterCallback("Unload", fun);
                break;
            case 'material':
                Cheat.RegisterCallback("Material", fun);
                break;
            case 'aim_fire':
                Cheat.RegisterCallback("ragebot_fire", fun);
            default:
                Cheat.RegisterCallback(callback, fun);
                break;
        }
    }, // Registers a callback within a said function.
    /*
    List of events:
     CreateMove (create_move): This function is called once per tick to create the player CUserCmd (used for prediction/physics simulation of the player), Because the mouse can be sampled at greater than the tick interval, there is a separate input_sample_frametime, which specifies how much additional mouse / keyboard simulation to perform, Gets called before Anti-Aim and Ragebot
     Draw (paint): Where you call render functions.
     FrameStageNotify (frame_stage_notify): Notification that we're moving into another stage during the frame. You can also callback a specific stage. https://github.com/ValveSoftware/source-sdk-2013/blob/master/sp/src/public/cdll_int.h#L135
     Unload (shutdown): Called when script gets unloaded.
     Material (material): Called before materials are applied. Material functions (except Create and Destroy) must be called in this callback
     ragebot_fire: Gets called when ragebot fires a shot, Returns target_index, hitbox, hitchance, safepoint, exploit.
    */
    execute_command: function (command) {
        return Cheat.ExecuteCommand(command);
    }, // Executing commands in in-game console.
    colored_log: function (r, g, b, a, text) {
        return Cheat.PrintColor(r, g, b, a, text);
    }, // Printing colored messages to the in-game console.
    log: function (text) {
        return Cheat.Print(text + "\n");
    } // Printing messages to the in-game console.
};
var input = {
    get_cursor_pos: function () {
        return Input.GetCursorPosition();
    }, // Returns an array object with X, Y for cursor position.
    is_key_pressed: function (vk) {
        return Input.IsKeyPressed(vk);
    } // Returns boolean value whether or not a key was pressed.
};
var world = {
    get_server_string: function () {
        return World.GetServerString();
    }, // Returns server IP.
    get_map_name: function () {
        return World.GetMapName();
    } // Returns current map name.
};
var antiaim = {
    set_lby_offset: function (degree) {
        return AntiAim.SetLBYOffset(degree);
    }, // Sets the LBY offset of your fake angle.
    set_real_offset: function (degree) {
        return AntiAim.SetRealOffset(degree);
    }, // Sets the offset of your real angle.
    set_fake_offset: function (degree) {
        return AntiAim.SetFakeOffset(degree)
    }, // Sets the offset of your fake angle.
    get_override: function () {
        return AntiAim.GetOverride();
    }, // Returns the anti-aim override state.
    set_override: function (state) {
        return AntiAim.SetOverride(state);
    } // Enables/disables anti-aim overriding.
};
var exploit = {
    override_tolerance: function (value) {
        return Exploit.OverrideTolerance(value);
    }, // Lower value results in faster double-tap.
    override_shift: function (value) {
        return Exploit.OverrideShift(value);
    }, // Higher value results in faster double-tap.
    enable_recharge: function () {
        return Exploit.EnableRecharge();
    }, // Enable automatic recharge
    disable_recharge: function () {
        return Exploit.DisableRecharge();
    }, // Disables automatic recharging
    recharge: function () {
        return Exploit.Recharge();
    }, // Forces a recharge.
    get_charge: function () {
        return Exploit.GetRecharge()
    } // Returns a fraction.
};
var ragebot = {
    ignore_target: function (entity_index) {
        return Ragebot.IgnoreTarget(entity_index);
    }, // Ignores a target for 1 tick
    force_hitbox_safety: function (hitbox_index) {
        return Ragebot.ForceHitboxSafety(hitbox_index);
    }, // Forces safety on a specific hitbox
    force_target_minimum_damage: function (entity_index, value) {
        return Ragebot.ForceTargetMinimumDamage(entity_index, value);
    }, // Overrides minimum damage on a specific target
    force_target_hitchance: function (entity_index, value) {
        return Ragebot.ForceTargetHitchance(entity_index, value);
    }, // Overrides hitchance on a specific target
    force_target_safety: function (entity_index) {
        return Ragebot.ForceTargetSafety(entity_index);
    }, // Forces safety on a specific target.
    force_target: function (entity_index) {
        return Ragebot.ForceTarget(entity_index);
    }, // Forces the rage-bot to target a specific entity.
    get_target: function () {
        return Ragebot.GetTarget();
    } // Used to get ragebot target.
};
var material = {
    refresh: function (material_index) {
        return Material.Refresh(material_index);
    }, // Used to apply new set key values.
    set_key_value: function (material_index, key, value) {
        return Material.SetKeyValue(material_index, key, value);
    }, // Used to set key values.
    get: function (name) {
        return Material.Get(name);
    }, // Used to get material index.
    destroy: function (name) {
        return Material.Destroy(name);
    }, // Returns true if material was destroyed successfully.
    create: function (name) {
        return Material.Create(name);
    } // Returns true if material was created successfully or false otherwise.
};
var chat_color = {
    white: '\x01',
    red: '\x02',
    light_purple: '\x03',
    green: '\x04',
    light_green: '\x05',
    lime: '\x06',
    gray: '\x08',
    yellow: '\x09',
    light_blue: '\x0A',
    cyan: '\x0B',
    blue: '\x0C',
    magenta: '\x0D',
    pink: '\x0E',
    light_red: '\x0F',
    gold: '\x10',
};

//#endregion

const is_debug = menu.new(UI.AddCheckbox, "| debug");

function on_paint() {
    if (!menu.is_opened() && menu.get(is_debug)) {
        const fonts = {
            font: render.add_font("Tahoma", 10, 100),
        };
        const screen = render.get_screen_size();

        const x = screen[0];
        const y = screen[1];

        render.string_custom(
            x - x + 10,
            y - y + 10,
            0,
            "realtime -> " + globals.realtime(),
            [255, 255, 255, 255],
            fonts.font
        );

        render.string_custom(
            x - x + 10,
            y - y + 30,
            0,
            "frametime -> " + Math.round(globals.frametime()),
            [255, 255, 255, 255],
            fonts.font
        );

        render.string_custom(
            x - x + 10,
            y - y + 50,
            0,
            "tick_interval -> " + globals.tick_interval().toFixed(10),
            [255, 255, 255, 255],
            fonts.font
        );

        render.string_custom(
            x - x + 10,
            y - y + 70,
            0,
            "tickrate -> " + globals.tickrate(),
            [255, 255, 255, 255],
            fonts.font
        );

        const tickcount = globals.tickcount();
        const color = [255, 255, 255, 255];

        if (tickcount > (tickcount + 14))
            color = [0, 255, 0, 250];

        render.string_custom(
            x - x + 10,
            y - y + 90,
            0,
            "tickcount -> " + tickcount,
            color,
            fonts.font
        );

        var latency = local.latency() * 1000 - 16;
        const color = [255, 255, 255, 255];

        if (latency > 100)
            color = [255, 0, 0, 250];

        render.string_custom(
            x - x + 10,
            y - y + 110,
            0,
            "latency -> " + latency,
            color,
            fonts.font
        );
    }
}

client.callback("paint", "on_paint");

function on_create_move() {

}

client.callback("create_move", "on_create_move")
