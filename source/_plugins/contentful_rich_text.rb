require 'rich_text_renderer'
require_relative './ui_template.rb'

class EmbeddedInlineEntryRenderer < RichTextRenderer::BaseNodeRenderer
  include UITemplate

  def render(node)
    entry = node['data']['target']
    case entry['sys']['content_type_id']
      when 'footnote'
        footnote_id = entry['sys']['id'] 
        create_footnote_html(footnote_id)
      else
        puts "Can't render embedded entry"
    end
  end
end

class CreateFootnotesPanel < RichTextRenderer::BaseNodeRenderer
  include UITemplate

  def render(node)
    entry = node['data']['target']

    case entry['sys']['content_type_id']
      when 'footnote'
        footnote_id = entry['sys']['id']
        footnote_body = entry['body']
        create_footnotes_panel(footnote_body, footnote_id)
      else
        puts "Can't render embedded entry"
    end
  end
end

class EmbeddedEntryRenderer < RichTextRenderer::BaseNodeRenderer
  def render(node)
    entry = node['data']['target']
    case entry['sys']['content_type_id']
      when 'pullQuote'
        "pullQuote"
      when 'figure'
        "figure"
      when 'table'
        "table"
      else
        puts "Can't render embedded entry"
    end
  end
end

class SilentNullRenderer < RichTextRenderer::BaseNodeRenderer
  def render(node)
    ""
  end
end

module Jekyll
  module DataFormatter
    def rich_text_to_html(content)
      renderer = RichTextRenderer::Renderer.new(
        nil => SilentNullRenderer, 
        'embedded-entry-inline' => EmbeddedInlineEntryRenderer, 
        'embedded-entry-block' => EmbeddedEntryRenderer
        )
      renderer.render(content)
    end

    def extract_footnotes_from_rich_text(content)
      renderer = RichTextRenderer::Renderer.new(
        nil => SilentNullRenderer, 
        'text' => SilentNullRenderer,
        'embedded-entry-block' => SilentNullRenderer,
        'embedded-entry-inline' => CreateFootnotesPanel,
        'embedded-asset-block' => SilentNullRenderer,
        )
      renderer.render(content)
    end
  end
end

Liquid::Template.register_filter(Jekyll::DataFormatter)