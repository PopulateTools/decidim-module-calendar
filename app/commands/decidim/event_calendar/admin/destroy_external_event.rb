# frozen_string_literal: true

module Decidim
  module EventCalendar
    module Admin
      class DestroyExternalEvent < Rectify::Command
        def initialize(event)
          @event = event
        end

        def call
          destroy_external_event

          broadcast(:ok)
        end

        private

        attr_reader :event

        def destroy_external_event
          event.destroy!
        end
      end
    end
  end
end
