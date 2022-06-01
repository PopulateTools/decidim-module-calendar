# frozen_string_literal: true

require "decidim/event_calendar/admin"
require "decidim/event_calendar/admin_engine"
require "decidim/event_calendar/engine"

module Decidim
  module EventCalendar
  end
end

Decidim.register_global_engine(
  :decidim_calendar, # this is the name of the global method to access engine routes
  ::Decidim::EventCalendar::Engine,
  at: "/calendar"
)

Decidim.register_global_engine(
  :decidim_admin_calendar, # this is the name of the global method to access engine routes
  ::Decidim::EventCalendar::AdminEngine,
  at: "/admin/calendar"
)
