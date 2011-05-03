Summary: A graphical GCOV front-end
Name: lcov
Version: 1.9
Release: 1
License: GPL
Group: Development/Tools
URL: http://ltp.sourceforge.net/coverage/lcov.php
Source0: http://downloads.sourceforge.net/ltp/lcov-%{version}.tar.gz
BuildRoot: /var/tmp/%{name}-%{version}-root
BuildArch: noarch

%description
LCOV is a graphical front-end for GCC's coverage testing tool gcov. It collects
gcov data for multiple source files and creates HTML pages containing the
source code annotated with coverage information. It also adds overview pages
for easy navigation within the file structure.

%prep
%setup -q -n lcov-%{version}

%build
exit 0

%install
rm -rf $RPM_BUILD_ROOT
make install PREFIX=$RPM_BUILD_ROOT

%clean
rm -rf $RPM_BUILD_ROOT

%files
%defattr(-,root,root)
/usr/bin
/usr/share
/etc

%changelog
* Wed Aug 13 2008 Peter Oberparleiter (Peter.Oberparleiter@de.ibm.com)
- changed description + summary text
* Mon Aug 20 2007 Peter Oberparleiter (Peter.Oberparleiter@de.ibm.com)
- fixed "Copyright" tag
* Mon Jul 14 2003 Peter Oberparleiter (Peter.Oberparleiter@de.ibm.com)
- removed variables for version/release to support source rpm building
- added initial rm command in install section
* Mon Apr 7 2003 Peter Oberparleiter (Peter.Oberparleiter@de.ibm.com)
- implemented variables for version/release
* Fri Oct 8 2002 Peter Oberparleiter (Peter.Oberparleiter@de.ibm.com)
- created initial spec file
