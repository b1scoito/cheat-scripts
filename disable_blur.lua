local convars = {
    ["disable_blur"] = cvar["@panorama_disable_blur"]
}

convars.disable_blur:set_raw_int(1)

client.set_event_callback(
    "shutdown",
    function(e)
        convars.disable_blur:set_raw_int(0)
    end
)
