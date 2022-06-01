# frozen_string_literal: true

module Decidim
  module EventCalendar
    class CalendarController < Decidim::EventCalendar::ApplicationController
      layout "calendar"

      def index
        @resources = %w(debate external_event meeting participatory_step)
        @resources = @resources << "consultation" if defined? Decidim::Consultation
      end

      def events
        events = Event.all(current_organization).collect do |event|
          Decidim::EventCalendar::Event.calendar(event)
        end

        render json: events, content_type: "application/json"
      end

      def gantt; end

      def gantt_tasks
        events = Decidim::ParticipatoryProcessStep.where.not(start_date: nil)
                                                  .order(decidim_participatory_process_id: :asc, position: :asc, start_date: :asc)
                                                  .map do |step|
          if step.organization == current_organization
            process_step = Decidim::EventCalendar::EventPresenter.new(step)
            Decidim::EventCalendar::Event.gantt(process_step)
          end
        end

        events = nil if events.all?(&:nil?)

        render json: events, content_type: "application/json"
      end

      def ical
        filename = "#{current_organization.name.parameterize}-calendar"
        response.headers["Content-Disposition"] = 'attachment; filename="' + filename + '.ical"'
        render plain: GeneralCalendar.for(current_organization), content_type: "text/calendar"
      end

      private

      def current_participatory_space; end

      def current_participatory_space_manifest
        @current_participatory_space_manifest ||= Decidim.find_participatory_space_manifest(:calendar)
      end
    end
  end
end
