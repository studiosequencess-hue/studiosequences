import React from 'react'
import CompanyEventsFormDialog from '@/components/partials/events/company.events.form.dialog'
import CompanyEventsPreviewDialog from '@/components/partials/events/company.events.preview.dialog'

const CompanyEventsDialogs = () => {
  return (
    <React.Fragment>
      <CompanyEventsPreviewDialog />
      <CompanyEventsFormDialog />
    </React.Fragment>
  )
}

export default CompanyEventsDialogs
