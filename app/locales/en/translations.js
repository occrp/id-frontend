export default {
  ticket: {
    'one': 'Request',
    'other': '{{count}} Requests',

    kind: {
      'one': 'Type',

      'person_ownership': {
        name: 'Identify what a person owns',
        shortName: 'Person',
      },
      'company_ownership': {
        name: 'Determine company ownership',
        shortName: 'Company',
      },
      'other': {
        name: 'Any other question',
        shortName: 'Other',
      }
    },
    status: {
      groups: {
        open: 'Open',
        closed: 'Closed'
      },

      'new': {
        name: 'New',
      },
      'in-progress': {
        name: 'In progress',
      },
      'closed': {
        name: 'Closed',
      },
      'cancelled': {
        name: 'Cancelled',
      }
    },
    deadline: {
      label: 'Deadline',
      desc: 'We will try to meet your deadline, but please note that our researchers are quite busy.<br /> Give them as much time as you possibly can!',
      prefix: 'due {{relativeTime}}'
    },
    sensitive: {
      label: 'Is it sensitive?',
      trueLabel: 'Sensitive request'
    },
    whySensitive: {
      label: 'Why is it sensitive?'
    },
    updatedAt: {
      label: 'Last update',
      prefix: 'updated {{relativeTime}}'
    },

    // Relationships
    requester: {
      'one': 'Requester',
      'other': 'Requesters',

      prefix: 'Submitted by {{requester}}'
    },
    responder: {
      'one': 'Responder',
      'other': 'Responders',

      label: 'Staff responders',
      empty: 'No one assigned',
    },

    // Person
    firstName: {
      label: 'First name'
    },
    lastName: {
      label: 'Last name'
    },
    background: {
      label: 'Background',
      formLabel: 'Your story',
      desc: 'What do you know so far?'
    },
    initialInformation: {
      label: 'Initial information',
      formLabel: 'Where have you looked?',
      desc: 'Any information you already have.'
    },
    bornAt: {
      label: 'Date of birth'
    },
    sourcesPerson: {
      label: 'Aliases',
      desc: 'Other spellings or cover names.'
    },
    connectionsPerson: {
      label: 'Family And Associates',
      desc: 'Known family relationships.'
    },
    businessActivities: {
      label: 'Business Activities'
    },

    // Company
    companyName: {
      label: 'Company name'
    },
    country: {
      label: 'Country registered'
    },
    backgroundCompany: {
      label: 'Company background',
      formLabel: 'Your story',
      desc: 'What do you know so far?'
    },
    sources: {
      label: 'Sources',
      formLabel: 'Where have you looked?',
      desc: 'What sources do you have so far?'
    },
    connections: {
      label: 'Connections',
      formLabel: 'Connections to other companies and people',
    },

    // Other
    backgroundOther: {
      label: 'Question',
      formLabel: 'What Do You Want To Know?',
      desc: 'Any information you already have.'
    },
  },

  profile: {
    search: {
      placeholder: 'Search users',
      noResults: 'No users found'
    }
  },

  activity: {
    'one': 'Activity',

    comment: {
      title: 'Leave a comment',
      submitButton: 'Post comment'
    },
    attachment: {
      action: '{{user}} attached files'
    },
    assign: {
      action: '{{user}} was assigned'
    },
    unassign: {
      action: '{{user}} was unassigned'
    },
    reopen: {
      action: 'reopened'
    }
  },

  attachment: {
    'other': 'Attachments',

    dropzone: {
      title: 'Upload files',
      activeTitle: 'Drop to upload',
      desc: 'Drag and drop files onto this area or {{select}}',
      select: 'Select a file'
    },
    filesSelected: '{{count}} files selected'
  },

  pods: {
    new: {
      title: 'Request Information',
      headline: 'Your request will be routed to our professional researchers, who will try to help.',
      form: {
        otherDetails: 'Other details',
        requestDetails: 'Request details',
        invalidMessage: 'Please fill in the fields marked above before continuing.',
        submitButton: 'Submit your request',
      }
    },
    browse: {
      title: 'My requests',
      newButton: 'New request',
    },
    view: {
      close: {
        button: '{{verb}} request',
        title: 'Are you sure you want to {{verb}} this request?',
        confirm: 'Yes, {{verb}} request',
        cancel: 'No, leave it open'
      },
      reopen: {
        button: 'Reopen request',
        title: 'Reason for reopening',
      }
    }
  },

  filters: {
    current: {
      title: 'Filtered by',
      clear: 'Clear all filters',
    },

    options: {
      all: 'All'
    },

    kind: {
      title: 'Filter by type',
    },
    requester: {
      title: 'Filter by who filed the request',
    },
    responder: {
      title: `Filter by who's assigned`,
      emptyOption: 'Assigned to nobody'
    },
    sort: {
      label: 'Sort',
      title: 'Sort by'
    }
  },

  pagination: {
    prev: 'Prev',
    next: 'Next'
  },

  actions: {
    upload: 'Upload',
    cancel: 'Cancel',
    assign: {
      shortForm: 'Assign',
      longForm: 'Assign to staff',
    },
    remove: 'Remove',
    reopen: 'Reopen'
  },

  prefixes: {
    on: 'on {{date}}',
    at: 'at {{time}}',
    by: 'by {{user}}'
  },

  errors: {
    genericInvalid: 'Please fill in this field'
  }
};
