

SirTrevor.Blocks.OrderedList = SirTrevor.Blocks.List.extend({

    type: "ordered_list",
    title: function() { return 'Orderedlist'; },
    icon_name: 'list',

    editorHTML: function()
    {
        return ['<div class="st-text-block" contenteditable="true"><ol><li></li></ol></div>'];
    }
  });