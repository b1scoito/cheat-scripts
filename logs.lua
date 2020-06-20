local function time_to_ticks(tick)
    return math.floor(0.5 + (tick / globals.tickinterval()))
end

-- Array indices in Lua start at 1.
-- In the 'hitgroup_names' array below, 'body' is at array index 1, 'head' is at index 2, 'chest' is at index 3, etc.
-- The hitgroup value for body is 0, head is 1, chest is 2, etc.
-- This array can be used to quickly get a hitgroup name from its value. Add one to the value for the array index of the name.
local hitgroup_names = {
    "generic",
    "head",
    "chest",
    "stomach",
    "left arm",
    "right arm",
    "left leg",
    "right leg",
    "neck",
    "?",
    "gear"
}

client.set_event_callback(
    "aim_fire",
    function(e) -- callback for aim fire, gets called when ragebot fires a bullet
        local flags = {
            e.teleported and "T" or "", -- target was breaking lag compensation (teleported)
            e.interpolated and "I" or "", -- target got interpolated
            e.extrapolated and "E" or "", -- target got extrapolated
            e.boosted and "B" or "", -- accuracy boost was used to increase the accuracy of the shot
            e.high_priority and "H" or "" -- shot was at high priority backtrack record (e.g. onshot backtrack record)
        }

        local group = hitgroup_names[e.hitgroup + 1] or "?"
        local latency = math.floor(client.latency() * 1000 + 0.5)

        client.color_log(
            86,
            177,
            255,
            string.format(
                "Fired at %s in the %s for %d damage (chance=%d%%, bt=%d, flags=%s, tick=%d, x=%d y=%d z=%d, ms=%d) [%d]",
                entity.get_player_name(e.target),
                group,
                e.damage,
                math.floor(e.hit_chance + 0.5),
                time_to_ticks(e.backtrack), -- this apparently doesn't work anymore. but i'll keep it there incase it gets added again.
                table.concat(flags),
                e.tick,
                e.x,
                e.y,
                e.z,
                latency,
                e.id
            )
        )
    end
)

client.set_event_callback(
    "aim_miss",
    function(e) -- callback for aim miss, gets called when ragebot misses a target
        local group = hitgroup_names[e.hitgroup + 1] or "?"
        local latency = math.floor(client.latency() * 1000 + 0.5)
        local reason = "?"

        if e.reason == "?" then
            reason = "? (resolver)"
        else
            reason = e.reason
        end

        client.color_log(
            255,
            63,
            63,
            string.format(
                "Missed at %s in the %s due to %s (chance=%d%%, ms=%d, tick=%d) [%d]",
                entity.get_player_name(e.target),
                group,
                reason,
                math.floor(e.hit_chance + 0.5),
                latency,
                globals.tickcount(),
                e.id
            )
        )
    end
)

client.set_event_callback(
    "aim_hit",
    function(e) -- callback for aim hit, gets called whenever ragebot hits a target
        local group = hitgroup_names[e.hitgroup + 1] or "?"
        local latency = math.floor(client.latency() * 1000 + 0.5)

        client.color_log(
            255,
            86,
            158,
            string.format(
                "Hit at %s in the %s for %d damage (chance=%d%%, ms=%d, tick=%d) (%d health remaining) [%d]",
                entity.get_player_name(e.target),
                group,
                e.damage,
                math.floor(e.hit_chance + 0.5),
                latency,
                globals.tickcount(), -- since aim_hit doesn't have tick i'll put it myself.
                entity.get_prop(e.target, "m_iHealth"),
                e.id
            )
        )
    end
)

client.set_event_callback(
    "player_hurt",
    function(e) -- callback for player hurt, gets called whenever a entity is hurt
        if
            e.userid == nil or e.attacker == nil or e.hitgroup < 0 or e.hitgroup > 10 or e.dmg_health == nil or
                e.health == nil
         then -- return those or bad stuff gonna happen
            return
        end

        if client.userid_to_entindex(e.userid) == entity.get_local_player() then -- if the entity is local player
            local group = hitgroup_names[e.hitgroup + 1]

            if group then
                client.color_log(
                    255,
                    86,
                    158,
                    string.format(
                        "Got hurt by %s in the %s for %d damage (%d health remaining)",
                        entity.get_player_name(client.userid_to_entindex(e.attacker)),
                        group,
                        e.dmg_health,
                        e.health
                    )
                )
            end
        end
    end
)
