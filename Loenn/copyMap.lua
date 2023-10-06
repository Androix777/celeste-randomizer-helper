local utils = require("utils")
local state = require("loaded_state")
local mapStruct = require("structs.map")

local script = {
    name = "copyMap",
    displayName = "Copy Map",
    tooltip = "Copy Map"
}

function script.prerun(args)
    local success, text = utils.serialize(mapStruct.encode(state.map), nil, nil, false)

    if success then
        love.system.setClipboardText(text)
    end
end

return script